import sys

with open('data.js', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    '"ไม่มี/โมฆะ"': '"ไม่มี/โมฆะ<span class=\'edge-label-sub\'>(ถือว่าไม่มีสัญญาก่อนสมรส)</span>"',
    '"มี (จดแจ้งพร้อมสมรส)"': '"มี (จดแจ้งพร้อม)<span class=\'edge-label-sub\'>(เป็นไปตามสัญญา)</span>"',
    '"สินสมรส ม.1474"': '"สินสมรส ม.1474<span class=\'edge-label-sub\'>(ได้มาระหว่างสมรส)</span>"',
    '"สินส่วนตัว ม.1471"': '"สินส่วนตัว ม.1471<span class=\'edge-label-sub\'>(มีก่อนสมรส/มรดก)</span>"',
    '"มีสินสมรสมาผสม"': '"มีสินสมรสมาผสม<span class=\'edge-label-sub\'>(ตกเป็นสินสมรส ม.1474(3))</span>"',
    '"ใช้เงินส่วนตัว 100%"': '"เงินส่วนตัว 100%<span class=\'edge-label-sub\'>(เป็นสินส่วนตัว ม.1472)</span>"',
    '"นิติกรรมทั่วไป ม.1476 ว.2"': '"นิติกรรมทั่วไป<span class=\'edge-label-sub\'>(ม.1476 ว.2 จัดการได้เอง)</span>"',
    '"นิติกรรมสำคัญ ม.1476 ว.1"': '"นิติกรรมสำคัญ<span class=\'edge-label-sub\'>(ม.1476 ว.1 ต้องยินยอม)</span>"',
    '"ภายนอกสุจริต+ค่าตอบแทน / ให้สัตยาบัน"': '"บุคคลภายนอกสุจริต<span class=\'edge-label-sub\'>(เพิกถอนไม่ได้)</span>"',
    '"หนี้ร่วม ม.1490(1)-(3)"': '"หนี้ร่วม ม.1490<span class=\'edge-label-sub\'>(รับผิดร่วมกัน)</span>"',
    '"หนี้ส่วนตัว"': '"หนี้ส่วนตัว<span class=\'edge-label-sub\'>(รับผิดเป็นการส่วนตัว)</span>"',
    '"ระหว่างสมรส / < 310 วัน"': '"ระหว่างสมรส / < 310 วัน<span class=\'edge-label-sub\'>(สันนิษฐานว่าเป็นบุตร)</span>"'
}

for old_str, new_str in replacements.items():
    content = content.replace(old_str, new_str)

with open('data.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("data.js successfully updated with descriptive edge labels.")
