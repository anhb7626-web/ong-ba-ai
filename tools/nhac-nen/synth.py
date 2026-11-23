import numpy as np, subprocess, sys, os
SR = 44100
rng = np.random.default_rng(7)
def mtof(m): return 440.0 * 2 ** ((m - 69) / 12)

def env_adsr(n, a, d, s, r_start, r):
    t = np.arange(n) / SR
    e = np.where(t < a, t / max(a,1e-4), 1.0)
    return e

def phase_from_freq(f):
    return 2 * np.pi * np.cumsum(f) / SR

def tranh(freq, dur=2.4, vol=1.0, bend=0.0):
    n = int(dur * SR); t = np.arange(n) / SR
    f = np.full(n, freq)
    if bend:  # nhấn: kéo lên rồi trả về
        b = np.interp(t, [0, 0.18, 0.32, 0.6, dur], [1, 1, 1 + bend, 1, 1])
        f = f * b
    # rung nhẹ cuối nốt (rung đàn tranh)
    f = f * (1 + 0.004 * np.sin(2*np.pi*5.5*t) * np.clip((t-0.5)/0.5, 0, 1))
    ph = phase_from_freq(f)
    out = np.zeros(n)
    for k in range(1, 9):
        amp = 1 / k ** 1.3 * (1.0 if k != 2 else 1.3)
        dec = 1.6 + 1.6 * k
        out += amp * np.sin(k * ph * (1 + 0.0008 * k)) * np.exp(-dec * t)
    att = np.clip(t / 0.004, 0, 1)
    return vol * out * att * 0.35

def flute(freq, dur, vol=1.0):
    n = int((dur + 0.25) * SR); t = np.arange(n) / SR
    vib = 1 + 0.006 * np.sin(2*np.pi*5.0*t) * np.clip((t - 0.25) / 0.4, 0, 1)
    ph = phase_from_freq(freq * vib)
    tone = np.sin(ph) + 0.22*np.sin(2*ph) + 0.06*np.sin(3*ph)
    noise = rng.standard_normal(n)
    # lọc tiếng hơi quanh tần số nốt
    from_n = np.convolve(noise, np.hanning(9)/4.5, 'same')
    breath = from_n * 0.05 * (0.6 + 0.4*np.exp(-t*6))
    e = np.interp(t, [0, 0.07, 0.15, dur, dur + 0.25], [0, 0.85, 1, 0.9, 0])
    return vol * (tone + breath) * e * 0.22

def trung(freq, vol=1.0):  # đàn t'rưng (tre gõ)
    dur = 0.9; n = int(dur*SR); t = np.arange(n)/SR
    out = (np.sin(2*np.pi*freq*t)*np.exp(-t*7) + 0.35*np.sin(2*np.pi*freq*3.95*t)*np.exp(-t*22)
           + 0.15*np.sin(2*np.pi*freq*9.1*t)*np.exp(-t*45))
    clickn = rng.standard_normal(n) * np.exp(-t*400) * 0.15
    return vol * (out + clickn) * np.clip(t/0.002, 0, 1) * 0.4

def musicbox(freq, vol=1.0):
    dur = 2.2; n = int(dur*SR); t = np.arange(n)/SR
    out = (np.sin(2*np.pi*freq*t)*np.exp(-t*2.2) + 0.25*np.sin(2*np.pi*freq*2*t)*np.exp(-t*4)
           + 0.18*np.sin(2*np.pi*freq*5.4*t)*np.exp(-t*9) + 0.08*np.sin(2*np.pi*freq*8.9*t)*np.exp(-t*16))
    return vol * out * np.clip(t/0.003, 0, 1) * 0.3

def pad(freqs, dur, vol=1.0):
    n = int((dur + 1.0)*SR); t = np.arange(n)/SR
    out = np.zeros(n)
    for f in freqs:
        for det in (-0.004, 0, 0.004):
            ph = 2*np.pi*f*(1+det)*t + rng.uniform(0, 6.28)
            out += np.sin(ph) + 0.3*np.sin(2*ph) + 0.1*np.sin(3*ph)
    e = np.interp(t, [0, 0.8, dur, dur + 1.0], [0, 1, 1, 0])
    return vol * out * e * 0.03

def bass(freq, dur=1.5, vol=1.0):
    n = int(dur*SR); t = np.arange(n)/SR
    out = np.sin(2*np.pi*freq*t) + 0.3*np.sin(4*np.pi*freq*t)*np.exp(-t*4)
    return vol * out * np.exp(-t*1.8) * np.clip(t/0.01, 0, 1) * 0.3

def mo(vol=1.0, pitch=850):  # mõ gỗ
    n = int(0.15*SR); t = np.arange(n)/SR
    out = np.sin(2*np.pi*pitch*t)*np.exp(-t*45) + 0.4*np.sin(2*np.pi*pitch*2.7*t)*np.exp(-t*70)
    return vol * out * 0.25

def trong(vol=1.0):  # trống cơm
    n = int(0.5*SR); t = np.arange(n)/SR
    f = 95 + 70*np.exp(-t*25)
    out = np.sin(phase_from_freq(f))*np.exp(-t*7)
    return vol * out * 0.45

def shaker(vol=1.0):
    n = int(0.08*SR); t = np.arange(n)/SR
    x = rng.standard_normal(n); x = x - np.convolve(x, np.ones(6)/6, 'same')
    return vol * x * np.exp(-t*60) * 0.05

class Mix:
    def __init__(self, seconds):
        self.n = int(seconds*SR); self.L = np.zeros(self.n + SR*4); self.R = np.zeros(self.n + SR*4)
        self.sendL = np.zeros_like(self.L); self.sendR = np.zeros_like(self.R)
    def add(self, sig, t, pan=0.0, rev=0.3):
        i = int(t*SR); j = min(i+len(sig), len(self.L)); s = sig[:j-i]
        gl = np.cos((pan+1)*np.pi/4); gr = np.sin((pan+1)*np.pi/4)
        self.L[i:j] += s*gl; self.R[i:j] += s*gr
        self.sendL[i:j] += s*gl*rev; self.sendR[i:j] += s*gr*rev
    def render(self, rt=2.2, out='out.mp3', loop=True):
        m = len(self.L); irn = int(rt*SR); ti = np.arange(irn)/SR
        def ir():
            x = rng.standard_normal(irn) * np.exp(-ti*6.9/rt)
            x = np.convolve(x, np.ones(4)/4, 'same'); x[:int(0.012*SR)] *= 0; return x / np.sqrt(np.sum(x**2))
        def conv(a, h):
            N = 1 << int(np.ceil(np.log2(len(a)+len(h))))
            return np.fft.irfft(np.fft.rfft(a, N)*np.fft.rfft(h, N), N)[:len(a)]
        L = self.L + conv(self.sendL, ir())*0.9; R = self.R + conv(self.sendR, ir())*0.9
        if loop:  # nối đuôi vào đầu để lặp liền mạch
            tailL, tailR = L[self.n:], R[self.n:]
            L = L[:self.n].copy(); R = R[:self.n].copy()
            L[:len(tailL)] += tailL; R[:len(tailR)] += tailR
        st = np.stack([L, R], 1)
        st = st / np.max(np.abs(st)) * 0.89
        raw = out + '.f32'; st.astype(np.float32).tofile(raw)
        subprocess.run(['ffmpeg','-y','-loglevel','error','-f','f32le','-ar',str(SR),'-ac','2','-i',raw,
                        '-af','loudnorm=I=-18:TP=-1.5:LRA=11','-ar','44100','-b:a','128k',out], check=True)
        os.remove(raw)
