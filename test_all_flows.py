#!/usr/bin/env python3
import os
import re

mapping = {
    'S01': 's01', 'S02': 's02', 'S03': 's03', 'S04': 's04_min_sneaker_shop',
    'S05': 's05_pim_preloved', 'S06': 's06_kitti_used_gear', 'S07': 's07',
    'S08': 's08', 'S09': 's09', 'S10': 's10_4_6', 'S11': 's11_6_6',
    'S12': 's12_proof_code_kt_4829', 'S13': 's13_proof_code', 'S14': 's14',
    'S15': 's15', 'S16': 's16', 'S17': 's17', 'S18': 's18',
    'S19': 's19_10', 'S20': 's20', 'S21': 's21', 'S22': 's22',
    'S23': 's23_1', 'S24': 's24_2', 'S25': 's25', 'S26': 's26',
    'S27': 's27', 'S28': 's28', 'S29': 's29', 'S30': 's30',
    'S31': 's31', 'S32': 's32', 'S33': 's33', 'S34': 's34',
    'S35': 's35', 'S36': 's36', 'S37': 's37', 'S38': 's38',
    'S39': 's39_notifications', 'S40': 's40', 'S41': 's41'
}

def get_links(sid):
    p = os.path.join(mapping[sid], 'code.html')
    with open(p, 'r', encoding='utf-8') as f:
        html = f.read()
    links = set(re.findall(r'data-proto-goto="([^"]+)"', html))
    if sid == 'S03':
        links.add('S04') # auto-advance timer
    return links

print("=== VERIFYING USABILITY TEST TASKS ===")

tasks = {
    'T1 ตรวจคู่ค้า': ['S01', 'S02', 'S03', 'S04'],
    'T1b ชื่อบัญชีไม่ตรง': ['S04', 'S07'],
    'T2 มีของจริง': ['S09', 'S10', 'S12', 'S13'],
    'T3 เบรกก่อนโอน (Safe)': ['S01', 'S17', 'S18', 'S19', 'S20'],
    'T3 เบรกก่อนโอน (Unsure)': ['S01', 'S17', 'S18', 'S19', 'S21'],
    'T4 ยืนยันตัวตน': ['S22', 'S23', 'S24', 'S25', 'S26', 'S27'],
    'T4b ยืนยันดีล+รีวิว (from S22)': ['S22', 'S28', 'S29', 'S30', 'S31'],
    'T4b ยืนยันดีล+รีวิว (from Bell S39)': ['S39', 'S28', 'S29', 'S30', 'S31'],
    'T5 รายงาน': ['S33', 'S34', 'S35', 'S36', 'S37'],
}

all_ok = True
for name, path in tasks.items():
    step_ok = True
    for i in range(len(path) - 1):
        src, dst = path[i], path[i+1]
        src_links = get_links(src)
        if dst not in src_links:
            print(f"❌ {name}: {src} -> {dst} NOT FOUND in {src_links}")
            step_ok = False
            all_ok = False
    if step_ok:
        print(f"✅ {name}: {' -> '.join(path)} [OK]")

print("\n=== VERIFYING ROOT TABS & BELL ===")
root_screens = ['S01', 'S09', 'S22', 'S26', 'S27', 'S33']
for rs in root_screens:
    links = get_links(rs)
    for expected in ['S01', 'S09', 'S22', 'S33', 'S39']:
        if expected not in links:
            print(f"❌ Root {rs} missing link to {expected}")
            all_ok = False
    print(f"✅ Root {rs} has tabs (S01, S09, S22, S33) & Bell (S39)")

print("\n=== OVERALL RESULT ===")
if all_ok:
    print("🎉 ALL USABILITY TEST TASKS AND ROOT LINKS 100% VERIFIED!")
else:
    print("❌ SOME CHECKS FAILED.")

