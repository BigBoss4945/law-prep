import sys

with open('data.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Add mindmap item to categories
old_overview = '''        {
            id: "overview",
            title: "ภาพรวม (Overview)",
            icon: "ph-map-trifold",
            items: [
                { id: "flowchart", title: "แผนผังแบบเต็ม (Flowchart)" },
                { id: "timeline", title: "ขั้นตอนการคิดวิเคราะห์ (Timeline)" }
            ]
        },'''

new_overview = '''        {
            id: "overview",
            title: "ภาพรวม (Overview)",
            icon: "ph-map-trifold",
            items: [
                { id: "flowchart", title: "แผนผังแบบเต็ม (Flowchart)" },
                { id: "timeline", title: "ขั้นตอนการคิดวิเคราะห์ (Timeline)" },
                { id: "mindmap", title: "แผนภาพเชื่อมโยง (Mindmap)" }
            ]
        },'''

content = content.replace(old_overview, new_overview)

# Add mindmapData just before flowData
mindmap_data_str = '''
const mindmapData = {
    id: "root",
    title: "กฎหมายครอบครัว",
    subtitle: "ภาพรวมการศึกษา",
    color: "#475569",
    children: [
        {
            id: "group1",
            title: "หมวด 4 ทรัพย์สินของคู่สมรส",
            subtitle: "ม.1465 - ม.1490",
            color: "#3b82f6",
            children: [
                {
                    id: "mm_phase1",
                    targetId: "phase1",
                    title: "Phase 1: ประเภททรัพย์",
                    subtitle: "สินส่วนตัว vs สินสมรส",
                    summary: "แยกประเภททรัพย์เพื่อหาอำนาจจัดการ ตามม.1471 และ ม.1474",
                    color: "#3b82f6"
                },
                {
                    id: "mm_phase2",
                    targetId: "phase2",
                    title: "Phase 2: การจัดการ",
                    subtitle: "ทำเองได้ หรือ ต้องยินยอม",
                    summary: "วิเคราะห์อำนาจจัดการสินสมรส (นิติกรรมสำคัญ 8 ประการ ตามม.1476)",
                    color: "#22c55e"
                },
                {
                    id: "mm_phase3",
                    targetId: "phase3",
                    title: "Phase 3: หนี้ร่วม",
                    subtitle: "หนี้ส่วนตัว vs หนี้ร่วม",
                    summary: "ความรับผิดในหนี้ที่เกิดขึ้นระหว่างสมรส กองไหนถูกยึดได้บ้าง (ม.1488-1490)",
                    color: "#ef4444"
                },
                {
                    id: "mm_law1",
                    targetId: "law_property",
                    title: "สรุปตัวบท ทรัพย์สิน",
                    subtitle: "รวมมาตราสำคัญ",
                    summary: "อ่านตัวบทฉบับเต็มของหมวดทรัพย์สิน พร้อมไฮไลท์จุดสำคัญ",
                    color: "#f59e0b"
                }
            ]
        },
        {
            id: "group2",
            title: "หมวด 2 บิดามารดากับบุตร",
            subtitle: "ม.1536 - ม.1539",
            color: "#8b5cf6",
            children: [
                {
                    id: "mm_phase4",
                    targetId: "phase4",
                    title: "Phase 4: สถานะบุตร",
                    subtitle: "บุตรชอบด้วยกฎหมาย",
                    summary: "ข้อสันนิษฐานความเป็นบุตร การโต้แย้ง การให้สัตยาบันรับเด็ก",
                    color: "#8b5cf6"
                },
                {
                    id: "mm_law2",
                    targetId: "law_parent_child",
                    title: "สรุปตัวบท บุตร",
                    subtitle: "รวมมาตราสำคัญ",
                    summary: "อ่านตัวบทฉบับเต็มของหมวดบิดามารดากับบุตร พร้อมไฮไลท์",
                    color: "#f59e0b"
                }
            ]
        }
    ]
};

const flowData = {'''

content = content.replace('const flowData = {', mindmap_data_str)

with open('data.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("data.js successfully updated with mindmapData.")
