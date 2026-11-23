import sys; sys.path.insert(0, '.')
from synth import *
N = dict(G3=55,A3=57,C4=60,D4=62,E4=64,F4=65,G4=67,A4=69,C5=72,D5=74,E5=76,F5=77,G5=79,A5=81,C3=48,G2=43)
def seq(s):
    return [(None if a=='r' else N[a], float(d)) for a, d in (x.split(':') for x in s.split())]
# Kìa con bướm vàng (giai điệu dân gian Pháp "Frère Jacques", đã thuộc phạm vi công cộng)
TUNE = ('C5:1 D5:1 E5:1 C5:1 C5:1 D5:1 E5:1 C5:1 E5:1 F5:1 G5:2 E5:1 F5:1 G5:2 '
        'G5:.5 A5:.5 G5:.5 F5:.5 E5:1 C5:1 G5:.5 A5:.5 G5:.5 F5:.5 E5:1 C5:1 C5:1 G4:1 C5:2 C5:1 G4:1 C5:2')
def place(m, inst, t0, B, shift=0, **kw):
    t = t0
    for n, d in seq(TUNE):
        if n: m.add(inst(n + shift, d*B), t, **kw)
        t += d*B
    return t

def ru():   # êm: sáo dẫn, đàn tranh hát đuổi (canon) sau 2 ô nhịp
    B = 60/66; bars = 8*3  # 3 lượt
    m = Mix(bars*4*B)
    for r in range(3):
        t0 = r*8*4*B
        place(m, lambda n, d: flute(mtof(n-12), d*0.95, 0.85), t0, B, pan=0.15, rev=0.45)
    # đàn tranh đuổi theo, vòng quanh để lặp liền
    total = bars*4*B
    for r in range(3):
        t = r*8*4*B + 2*4*B
        for n, d in seq(TUNE):
            if n: m.add(tranh(mtof(n-12), 2.2, 0.45, bend=0.04 if d >= 2 else 0), t % total, pan=-0.35, rev=0.4)
            t += d*B
    for i in range(bars):  # nền: nốt Đô trầm + pad
        tb = i*4*B
        m.add(pad([mtof(48), mtof(55), mtof(64)], 4*B, 0.7), tb, rev=0.5)
        m.add(bass(mtof(36), 2.5, 0.5), tb, rev=0.2)
    m.render(2.6, 'buom-1-em.mp3')

def vui():  # vui: t'rưng dẫn, trống cơm + mõ, hộp nhạc đuổi
    B = 60/104; bars = 8*3; total = bars*4*B
    m = Mix(total)
    for r in range(3):
        t0 = r*8*4*B
        place(m, lambda n, d: trung(mtof(n), 0.9), t0, B, pan=0.15, rev=0.25)
        t = t0 + 2*4*B
        for n, d in seq(TUNE):
            if n: m.add(musicbox(mtof(n-12), 0.5), t % total, pan=-0.35, rev=0.35)
            t += d*B
    for i in range(bars):
        tb = i*4*B
        for bt, nn in ((0, 48), (1, 55), (2, 48), (3, 55)): m.add(bass(mtof(nn), 0.8, 0.8), tb + bt*B, rev=0.1)
        m.add(trong(0.9), tb); m.add(trong(0.55), tb + 2*B)
        for bt in (1, 3): m.add(mo(0.7), tb + bt*B, pan=0.4, rev=0.2)
        for e in range(8): m.add(shaker(1.0 if e % 2 else 0.5), tb + e*B/2, pan=-0.5, rev=0.05)
    m.render(1.6, 'buom-2-vui.mp3')
ru(); vui()
