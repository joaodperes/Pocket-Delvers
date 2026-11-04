from PIL import Image, ImageDraw
from pathlib import Path
out=Path(__file__).parent/'assets';out.mkdir(exist_ok=True)
B='#101d2b';S='#e7b99c';W='#f2e3c7';G='#e3c581';T='#73899d'
def human(name,cloak,armour,head,weapon):
 im=Image.new('RGBA',(20,20));d=ImageDraw.Draw(im)
 d.rectangle((5,15,8,19),fill=B);d.rectangle((11,15,14,19),fill=B)
 d.rectangle((6,15,8,18),fill=armour);d.rectangle((11,15,13,18),fill=armour)
 d.polygon([(4,9),(15,9),(18,17),(2,17)],fill=B);d.polygon([(5,9),(14,9),(16,16),(4,16)],fill=cloak)
 d.rectangle((7,10,12,15),fill=armour);d.line((7,13,12,13),fill=G,width=1)
 d.rectangle((2,10,5,14),fill=B);d.rectangle((3,11,5,13),fill=armour)
 d.rectangle((14,10,17,14),fill=B);d.rectangle((14,11,16,13),fill=armour)
 d.rectangle((5,4,14,10),fill=B);d.rectangle((6,5,13,9),fill=S);d.point((8,7),fill=B);d.point((11,7),fill=B)
 if head=='helm':d.rectangle((5,2,14,5),fill=T);d.rectangle((9,4,10,9),fill=T)
 if head=='hood':d.polygon([(3,7),(7,1),(12,1),(16,7),(14,9),(12,4),(7,4),(5,9)],fill=cloak)
 if head=='hat':d.polygon([(5,5),(9,0),(13,5)],fill=cloak);d.rectangle((4,5,15,6),fill=cloak)
 if weapon=='sword':d.line((16,15,19,3),fill=W,width=2);d.line((15,12,19,13),fill=G,width=2)
 if weapon=='staff':d.line((17,18,17,3),fill=G,width=2);d.ellipse((15,1,19,5),fill='#5ba9d2')
 if weapon=='bow':d.arc((12,2,19,17),-100,100,fill=G,width=2);d.line((16,4,16,15),fill=W)
 if weapon=='dagger':d.line((15,14,19,8),fill=W,width=2)
 im.save(out/f'{name}.png')
human('guardian','#467e91','#92b3bc','helm','sword')
human('arcanist','#7d68ae','#a38bca','hat','staff')
human('ranger','#568e65','#769767','hood','bow')
human('rogue','#7f4e63','#ab7a86','hood','dagger')
human('skeleton','#c1c3af','#e2dfcf','helm','sword')
human('archer','#8c555b','#bd7c66','hood','bow')
im=Image.new('RGBA',(20,20));d=ImageDraw.Draw(im);d.ellipse((2,5,17,18),fill=B);d.ellipse((3,5,16,17),fill='#65b67c');d.rectangle((3,11,16,17),fill='#65b67c');d.rectangle((6,9,8,11),fill=B);d.rectangle((12,9,14,11),fill=B);im.save(out/'slime.png')
for name,body in [('brute','#9c5968'),('boss','#713f61')]:
 im=Image.new('RGBA',(20,20));d=ImageDraw.Draw(im);d.rectangle((4,13,8,19),fill=B);d.rectangle((11,13,15,19),fill=B);d.polygon([(1,8),(5,4),(15,4),(19,8),(17,17),(3,17)],fill=B);d.polygon([(2,9),(5,5),(15,5),(18,9),(16,16),(4,16)],fill=body);d.rectangle((5,3,14,10),fill=B);d.rectangle((6,4,13,9),fill=body);d.polygon([(4,4),(0,0),(3,8)],fill=G);d.polygon([(16,4),(19,0),(17,8)],fill=G);d.rectangle((7,6,8,7),fill=G);d.rectangle((11,6,12,7),fill=G);im.save(out/f'{name}.png')
for size in [192,512]:
 im=Image.new('RGB',(size,size),'#131a25');d=ImageDraw.Draw(im);u=size/64
 def pts(p):return [(round(x*u),round(y*u)) for x,y in p]
 d.rounded_rectangle((5*u,5*u,59*u,59*u),radius=12*u,fill='#263647',outline='#cda66f',width=round(2*u))
 d.polygon(pts([(32,7),(52,29),(32,54),(12,29)]),fill='#d9b37a');d.polygon(pts([(32,12),(47,30),(32,49),(17,30)]),fill='#303a4c')
 d.line(pts([(21,18),(43,43)]),fill='#e5d5ab',width=round(5*u));d.line(pts([(43,18),(21,43)]),fill='#87d6bc',width=round(5*u));im.save(out/f'icon-{size}.png')
