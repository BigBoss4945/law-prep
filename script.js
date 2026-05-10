document.addEventListener('DOMContentLoaded', () => {
    const sidebarNav = document.getElementById('sidebar-nav');
    const contentArea = document.getElementById('content-area');
    const timelineContainer = document.getElementById('timeline-container');
    const examContainer = document.getElementById('exam-container');
    const examYear = document.getElementById('exam-year');
    const examTitle = document.getElementById('exam-title');
    const examPriority = document.getElementById('exam-priority');
    const examTopicsList = document.getElementById('exam-topics-list');
    const examQuestion = document.getElementById('exam-question');
    const examAnswerBox = document.getElementById('exam-answer-box');
    const examIssue = document.getElementById('exam-issue');
    const examToggleAnswer = document.getElementById('exam-toggle-answer');
    const popover = document.getElementById('hover-popover');
    const popoverTitle = document.getElementById('popover-title');
    const popoverDesc = document.getElementById('popover-desc');
    const popoverBadge = document.getElementById('popover-badge');
    const flowchartContainer = document.getElementById('flowchart-container');
    const flowPopover = document.getElementById('flow-popover');
    const fpTitle = document.getElementById('fp-title');
    const fpDetail = document.getElementById('fp-detail');
    const fpLaw = document.getElementById('fp-law');
    const fpLawWrapper = document.getElementById('fp-law-wrapper');
    const fpSource = document.getElementById('fp-source');
    const fpSourceLink = document.getElementById('fp-source-link');
    // Flow Detail Panel (side panel)
    const fdPanel = document.getElementById('flow-detail-panel');
    const fdpTitle = document.getElementById('fdp-title');
    const fdpDetail = document.getElementById('fdp-detail');
    const fdpExtended = document.getElementById('fdp-extended');
    const fdpExample = document.getElementById('fdp-example');
    const fdpExampleWrapper = document.getElementById('fdp-example-wrapper');
    const fdpCaution = document.getElementById('fdp-caution');
    const fdpCautionWrapper = document.getElementById('fdp-caution-wrapper');
    const fdpLaw = document.getElementById('fdp-law');
    const fdpLawWrapper = document.getElementById('fdp-law-wrapper');
    const fdpSource = document.getElementById('fdp-source');
    const fdpSourceLink = document.getElementById('fdp-source-link');
    const fdpGoContent = document.getElementById('fdp-go-content');
    const fdpClose = document.getElementById('fdp-close');
    
    const mindmapContainer = document.getElementById('mindmap-container');
    const compareContainer = document.getElementById('compare-container');
    const mmPopover = document.getElementById('mm-popover');
    const mmTitle = document.getElementById('mm-title');
    const mmSummary = document.getElementById('mm-summary');

    let popoverTimeout;
    let flowchartReady = false;
    let scale = 0.55, translateX = 60, translateY = 40;
    let isDragging = false, dragStartX, dragStartY;

    // --- Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'light-mode';
    document.body.className = savedTheme;
    updateThemeIcon();

    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-mode');
        document.body.classList.toggle('light-mode', !isDark);
        localStorage.setItem('theme', isDark ? 'dark-mode' : 'light-mode');
        updateThemeIcon();
    });

    function updateThemeIcon() {
        const icon = themeToggle.querySelector('i');
        if (document.body.classList.contains('dark-mode')) {
            icon.className = 'ph ph-sun';
        } else {
            icon.className = 'ph ph-moon';
        }
    }

    // --- Search Logic ---
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        if (!term) {
            document.querySelectorAll('.nav-item').forEach(b => b.style.display = 'block');
            document.querySelectorAll('.nav-category').forEach(c => c.style.display = 'block');
            return;
        }

        document.querySelectorAll('.nav-category').forEach(cat => {
            let hasVisible = false;
            cat.querySelectorAll('.nav-item').forEach(item => {
                const matches = item.textContent.toLowerCase().includes(term);
                item.style.display = matches ? 'block' : 'none';
                if (matches) hasVisible = true;
            });
            cat.style.display = hasVisible ? 'block' : 'none';
        });
    });

    if (examToggleAnswer) {
        examToggleAnswer.addEventListener('click', () => {
            const isHidden = examAnswerBox.style.display === 'none';
            examAnswerBox.style.display = isHidden ? 'block' : 'none';
            examToggleAnswer.innerHTML = isHidden ? '<i class="ph ph-eye-slash"></i> ซ่อนธงคำตอบ' : '<i class="ph ph-eye"></i> ดูธงคำตอบ / ประเด็นวินิจฉัย';
        });
    }

    function renderExam(examId) {
        const data = examData[examId];
        if (!data) return;
        examYear.textContent = `ปี ${data.year}`;
        examTitle.textContent = `ข้อสอบปลายภาค (อ.วิมพัท)`;
        examPriority.textContent = data.priority;
        examTopicsList.innerHTML = data.topics.map(t => `<span class="badge badge-info">${t}</span>`).join(' ');
        examQuestion.innerHTML = data.question.replace(/\n/g, '<br>');
        examIssue.innerHTML = data.issue.replace(/\n/g, '<br>');
        examAnswerBox.style.display = 'none';
        examToggleAnswer.innerHTML = '<i class="ph ph-eye"></i> ดูธงคำตอบ / ประเด็นวินิจฉัย';
    }

    // ─── Sidebar ────────────────────────────────────────────────────
    function renderSidebar() {
        appData.categories.forEach(category => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'nav-category';
            categoryDiv.innerHTML = `<div class="nav-category-title"><i class="ph ${category.icon}"></i> ${category.title}</div>`;
            category.items.forEach(item => {
                const btn = document.createElement('button');
                btn.className = 'nav-item';
                btn.textContent = item.title;
                btn.dataset.id = item.id;
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    if (item.id === 'timeline') showView('timeline');
                    else if (item.id === 'mindmap') showView('mindmap');
                    else if (item.id === 'flowchart') showView('flowchart');
                    else if (item.id.startsWith('compare_')) { renderCompare(item.id); showView('compare'); }
                    else if (item.id.startsWith('exam_')) { renderExam(item.id); showView('exam'); }
                    else { renderContent(item.id); showView('content'); }
                });
                categoryDiv.appendChild(btn);
            });
            sidebarNav.appendChild(categoryDiv);
        });
    }

    function showView(view, data = null) {
        timelineContainer.style.display = 'none';
        contentArea.style.display = 'none';
        if (examContainer) examContainer.style.display = 'none';
        if (mindmapContainer) mindmapContainer.style.display = 'none';
        if (flowchartContainer) flowchartContainer.style.display = 'none';
        if (compareContainer) compareContainer.style.display = 'none';

        if (view === 'timeline') {
            timelineContainer.style.display = 'block';
        } else if (view === 'mindmap') {
            mindmapContainer.style.display = 'block';
            renderMindmap();
        } else if (view === 'compare') {
            compareContainer.style.display = 'block';
        } else if (view === 'flowchart') {
            flowchartContainer.style.display = 'block';
            if (!flowchartReady) {
                initFlowchart();
                flowchartReady = true;
            }
            updateTransform();
        } else if (view === 'exam') {
            examContainer.style.display = 'block';
        } else {
            contentArea.style.display = 'block';
        }
    }

    // ─── Mindmap ─────────────────────────────────────────────────────
    function renderMindmap() {
        const treeContainer = document.getElementById('mindmap-tree');
        if (treeContainer.innerHTML.trim() !== '') return; // Render once

        let html = `
            <div class="mm-root-node">
                <h3>${mindmapData.title}</h3>
                <p>${mindmapData.subtitle}</p>
            </div>
            <div class="mm-groups">
        `;

        mindmapData.children.forEach(group => {
            html += `
                <div class="mm-group">
                    <div class="mm-group-header" style="border-color: ${group.color};">
                        <h4>${group.title}</h4>
                        <p>${group.subtitle}</p>
                    </div>
                    <div class="mm-children">
            `;
            group.children.forEach(node => {
                html += `
                        <div class="mm-node" style="border-left-color: ${node.color};" 
                             data-target="${node.targetId}" 
                             data-title="${node.title}" 
                             data-summary="${node.summary}">
                            <h4 class="mm-node-title"><i class="ph-fill ph-check-circle" style="color: ${node.color}"></i> ${node.title}</h4>
                            <p class="mm-node-subtitle">${node.subtitle}</p>
                        </div>
                `;
            });
            html += `
                    </div>
                </div>
            `;
        });
        html += `</div>`;
        treeContainer.innerHTML = html;

        // Add event listeners
        document.querySelectorAll('.mm-node').forEach(node => {
            node.addEventListener('mouseenter', (e) => {
                const rect = node.getBoundingClientRect();
                mmTitle.textContent = node.getAttribute('data-title');
                mmSummary.textContent = node.getAttribute('data-summary');
                
                // Adjust popover position if it goes off screen
                let leftPos = rect.right + 20;
                if (leftPos + 320 > window.innerWidth) {
                    leftPos = rect.left - 340;
                }
                
                mmPopover.style.left = `${leftPos}px`;
                mmPopover.style.top = `${rect.top}px`;
                mmPopover.classList.add('visible');
            });
            node.addEventListener('mouseleave', () => {
                mmPopover.classList.remove('visible');
            });
            node.addEventListener('click', (e) => {
                const targetId = node.getAttribute('data-target');
                mmPopover.classList.remove('visible');
                
                // Update sidebar active state visually
                document.querySelectorAll('.nav-item').forEach(i => {
                    i.classList.remove('active');
                    if(i.textContent.includes(node.getAttribute('data-title').split(':')[0])) {
                        i.classList.add('active');
                    }
                });
                
                renderContent(targetId);
                showView('content');
            });
        });
    }

    // ─── Timeline ────────────────────────────────────────────────────
    function renderTimeline() {
        const treeContainer = document.getElementById('timeline-tree');
        treeContainer.innerHTML = timelineData.map((phase, phaseIdx) => `
            <div class="timeline-phase" data-phase="${phase.phaseId}">
                <div class="phase-header" onclick="toggleTimelinePhase(${phaseIdx})">
                    <div class="phase-icon color-${phase.color}">
                        <i class="ph ${phase.icon}"></i>
                    </div>
                    <div class="phase-info">
                        <h3>${phase.title}</h3>
                        <p>${phase.steps.length} ขั้นตอนหลัก</p>
                    </div>
                    <i class="ph ph-caret-down phase-chevron" id="chevron-${phaseIdx}"></i>
                </div>
                <div class="phase-steps" id="steps-${phaseIdx}" style="display: ${phaseIdx === 0 ? 'block' : 'none'}">
                    ${phase.steps.map((step, idx) => `
                        <div class="timeline-step">
                            <div class="step-marker">
                                <span class="step-dot color-${phase.color}"></span>
                                ${idx !== phase.steps.length - 1 ? `<span class="step-line color-${phase.color}"></span>` : ''}
                            </div>
                            <div class="step-content">
                                <div class="step-header">
                                    <span class="step-tag">${step.tag}</span>
                                    <h4>${step.title}</h4>
                                </div>
                                <p class="step-subtitle">${step.subtitle}</p>
                                <p class="step-desc">${step.desc}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    window.toggleTimelinePhase = function(idx) {
        const steps = document.getElementById(`steps-${idx}`);
        const chevron = document.getElementById(`chevron-${idx}`);
        const isOpen = steps.style.display === 'block';
        
        // Close all
        document.querySelectorAll('.phase-steps').forEach(s => s.style.display = 'none');
        document.querySelectorAll('.phase-chevron').forEach(c => c.style.transform = 'rotate(0deg)');
        
        if (!isOpen) {
            steps.style.display = 'block';
            chevron.style.transform = 'rotate(180deg)';
        }
    };

    // ─── Content ─────────────────────────────────────────────────────
    function renderContent(id) {
        const data = appData.content[id];
        if (!data) return;
        document.querySelector('.main-content').scrollTop = 0;
        const phases = [
            { id: 'phase1', label: '1. ประเภททรัพย์' },
            { id: 'phase2', label: '2. การจัดการ' },
            { id: 'phase3', label: '3. หนี้ร่วม' },
            { id: 'phase4', label: '4. บุตร' }
        ];
        let stepperHtml = '';
        if (id.startsWith('phase')) {
            stepperHtml = '<div class="mini-stepper">';
            phases.forEach((p, idx) => {
                stepperHtml += `<div class="stepper-item ${p.id === id ? 'active' : ''}">${p.label} ${p.id === id ? '📍' : ''}</div>`;
                if (idx < phases.length - 1) stepperHtml += '<i class="ph ph-caret-right stepper-divider"></i>';
            });
            stepperHtml += '</div>';
        }
        let html = `${stepperHtml}<div class="article-header animate-fade-in">
            <span class="badge">${data.badge}</span>
            <h1 class="article-title">${data.title}</h1>
            <p class="article-summary">${data.summary}</p>
        </div>`;
        data.sections.forEach(sec => {
            const isWarning = sec.title.includes('⚠️');
            html += `<div class="content-section ${isWarning ? 'warning' : ''}"><h3 class="section-title">${sec.title}</h3><div class="section-body">${sec.content}</div></div>`;
        });
        if (data.relatedLaws) {
            html += `<div class="laws-container"><span class="laws-label">มาตราที่เกี่ยวข้อง:</span>${data.relatedLaws.map(l => `<span class="law-tag">${l}</span>`).join('')}</div>`;
        }
        contentArea.innerHTML = html;
    }

    // Welcome
    const msgs = ["หายใจเข้าลึกๆ... แล้วมาลุยกัน! 📚", "อีกนิดเดียวก็จะสอบแล้ว คุณทำได้แน่นอน! 💪", "ทบทวนวันละนิด พิชิตเกรด A ✨", "กฎหมายครอบครัวไม่ยากเกินความตั้งใจครับ 🎯"];
    const wt = document.querySelector('.welcome-state h2');
    if (wt) wt.innerHTML = msgs[Math.floor(Math.random() * msgs.length)];

    // ================================================================
    //  FLOWCHART ENGINE
    // ================================================================

    // Half-sizes
    const NODE_SIZES = {
        diamond: { hw: 110, hh: 110 }, 
        primary: { hw: 130, hh: 85 },
        caution: { hw: 130, hh: 70 },
        default: { hw: 120, hh: 75 },
    };

    function getHalfSize(node) {
        if (node.shape === 'diamond') return NODE_SIZES.diamond;
        if (node.type === 'primary') return NODE_SIZES.primary;
        if (node.shape === 'caution_pill') return NODE_SIZES.caution;
        return NODE_SIZES.default;
    }

    let activeFlowNode = null; // track which node is selected

    function pts(node) {
        const { hw, hh } = getHalfSize(node);
        const { x, y } = node;
        return { top: [x, y - hh], bottom: [x, y + hh], left: [x - hw, y], right: [x + hw, y], cx: x, cy: y };
    }

    function makePath(d) {
        const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p.setAttribute('d', d);
        p.setAttribute('fill', 'none');
        p.setAttribute('stroke', '#94a3b8');
        p.setAttribute('stroke-width', '2.5');
        p.setAttribute('marker-end', 'url(#arrow)');
        return p;
    }

    function makeLabel(svg, text, x, y) {
        const fo = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        fo.setAttribute('x', x); 
        fo.setAttribute('y', y);
        fo.setAttribute('width', '1'); 
        fo.setAttribute('height', '1');
        fo.style.overflow = 'visible';
        fo.innerHTML = `<div xmlns="http://www.w3.org/1999/xhtml" class="edge-label-wrapper"><div class="edge-label-box">${text}</div></div>`;
        svg.appendChild(fo);
    }

    function initFlowchart() {
        const nodesLayer = document.getElementById('nodes-layer');
        const edgesSvg = document.getElementById('edges-svg');
        if (!nodesLayer || !edgesSvg) return;

        nodesLayer.innerHTML = '';
        const defs = edgesSvg.querySelector('defs');
        edgesSvg.innerHTML = '';
        if (defs) edgesSvg.appendChild(defs);

        // Draw Phase Groups
        if (flowData.phaseGroups) {
            flowData.phaseGroups.forEach(g => {
                const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                rect.setAttribute('x', g.x); rect.setAttribute('y', g.y);
                rect.setAttribute('width', g.w); rect.setAttribute('height', g.h);
                rect.setAttribute('rx', '24'); rect.setAttribute('fill', g.color);
                rect.setAttribute('stroke', g.border); rect.setAttribute('stroke-width', '2');
                rect.setAttribute('stroke-dasharray', '8,6');
                edgesSvg.insertBefore(rect, edgesSvg.firstChild);

                const fo = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
                fo.setAttribute('x', g.x + 20); fo.setAttribute('y', g.y + 20);
                fo.setAttribute('width', '800'); fo.setAttribute('height', '80');
                fo.innerHTML = `<div xmlns="http://www.w3.org/1999/xhtml" class="phase-group-label" style="border-color:${g.border}; color:${g.border.replace('fe','7e')}; background:${g.color}">${g.label}</div>`;
                edgesSvg.insertBefore(fo, edgesSvg.firstChild);
            });
        }

        // Draw Nodes — now also draw caution nodes as visible pills!
        flowData.nodes.forEach(node => {
            if (node.shape === 'warning' && !node.hidden) return; // skip old-style hidden warnings
            
            const isCaution = node.hidden || node.shape === 'warning';

            const el = document.createElement('div');
            if (isCaution) {
                el.className = `flow-node shape-caution_pill type-caution`;
            } else {
                el.className = `flow-node shape-${node.shape || 'rect'} type-${node.type || 'default'}`;
            }
            el.style.left = `${node.x}px`;
            el.style.top = `${node.y}px`;

            if (isCaution) {
                el.innerHTML = `<div class="node-content"><i class="ph ph-warning-circle" style="color:#d97706;margin-right:6px;"></i><strong>${node.title.replace('⚠️ ', '')}</strong></div>`;
            } else {
                el.innerHTML = `<div class="node-content"><strong>${node.title}</strong></div>`;
            }
            el.id = `node-${node.id}`;

            // Hover popover
            el.addEventListener('mouseenter', () => {
                if (fdPanel.classList.contains('visible')) return; // Don't show if side panel is active
                
                clearTimeout(popoverTimeout);
                fpTitle.innerHTML = node.title;
                fpDetail.innerHTML = node.detail || '';
                fpLaw.innerHTML = node.law ? `<i class="ph ph-scales"></i> ${node.law}` : '';
                fpLawWrapper.style.display = node.law ? 'block' : 'none';
                fpSource.style.display = node.lawLink ? 'block' : 'none';
                if (node.lawLink) fpSourceLink.href = node.lawLink;

                const rect = el.getBoundingClientRect();
                let left = rect.right + 20;
                let top = rect.top;
                if (left + 380 > window.innerWidth) left = rect.left - 400;
                flowPopover.style.left = `${left}px`;
                flowPopover.style.top = `${top}px`;
                flowPopover.classList.add('visible');
            });

            el.addEventListener('mouseleave', () => {
                popoverTimeout = setTimeout(() => flowPopover.classList.remove('visible'), 200);
            });

            // Click to open side panel
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                flowPopover.classList.remove('visible'); // Hide hover popover
                
                // highlight active node
                document.querySelectorAll('.flow-node.active').forEach(n => n.classList.remove('active'));
                el.classList.add('active');
                activeFlowNode = node;

                fdpTitle.innerHTML = node.title;
                fdpDetail.innerHTML = node.detail || '';
                
                // New Extended Fields
                if (node.extendedDetail) {
                    fdpExtended.innerHTML = node.extendedDetail;
                    fdpExtended.style.display = 'block';
                } else {
                    fdpExtended.style.display = 'none';
                }

                if (node.example) {
                    fdpExample.innerHTML = node.example;
                    fdpExampleWrapper.style.display = 'block';
                } else {
                    fdpExampleWrapper.style.display = 'none';
                }

                if (node.caution) {
                    fdpCaution.innerHTML = node.caution;
                    fdpCautionWrapper.style.display = 'block';
                } else {
                    fdpCautionWrapper.style.display = 'none';
                }

                fdpLaw.innerHTML = node.law ? `<i class="ph ph-scales"></i> ${node.law}` : '';
                fdpLawWrapper.style.display = node.law ? 'block' : 'none';
                fdpSource.style.display = node.lawLink ? 'block' : 'none';
                if (node.lawLink) fdpSourceLink.href = node.lawLink;

                // Determine content target
                const map = { start: 'phase1', is_prenup: 'phase1', asset_type: 'phase1', marital_flow: 'phase1', private_manage: 'phase2', voidable: 'phase2', must_consent: 'phase2', joint_debt: 'phase3', debt_type: 'phase3', p4_start: 'phase4', marital_status: 'phase4', p4_married: 'phase4', p4_dispute: 'phase4', birth_lock: 'phase4', p4_unmarried: 'phase4', p4_legit: 'phase4', p4_3ways: 'phase4' };
                const pid = map[node.id] || 'phase1';
                fdpGoContent.onclick = () => {
                    document.querySelector(`.nav-item[data-id="${pid}"]`).click();
                    fdPanel.classList.remove('visible');
                    document.querySelectorAll('.flow-node.active').forEach(n => n.classList.remove('active'));
                };

                fdPanel.classList.add('visible');
            });

            nodesLayer.appendChild(el);
        });

        // Close panel on click outside
        if (fdpClose) {
            fdpClose.addEventListener('click', () => {
                fdPanel.classList.remove('visible');
                document.querySelectorAll('.flow-node.active').forEach(n => n.classList.remove('active'));
            });
        }

        // Draw Edges
        const nodeMap = {};
        flowData.nodes.forEach(n => nodeMap[n.id] = n);

        flowData.edges.forEach(edge => {
            const fn = nodeMap[edge.from];
            const tn = nodeMap[edge.to];
            if (!fn || !tn) return;

            const fp = pts(fn);
            const tp = pts(tn);
            let d;
            const GAP = 30; // spacing for elbow turns

            if (edge.type === 'vertical') {
                const [sx, sy] = fp.bottom;
                const [ex, ey] = tp.top;
                const midy = (sy + ey) / 2;
                d = Math.abs(sx - ex) < 10 ? `M ${sx} ${sy} L ${ex} ${ey}` : `M ${sx} ${sy} L ${sx} ${midy} L ${ex} ${midy} L ${ex} ${ey}`;
            } else if (edge.type === 'elbow_left') {
                const [sx, sy] = fp.left; const [ex, ey] = tp.top;
                const midY = sy;
                d = `M ${sx} ${sy} L ${ex} ${midY} L ${ex} ${ey}`;
            } else if (edge.type === 'elbow_right') {
                const [sx, sy] = fp.right; const [ex, ey] = tp.top;
                const midY = sy;
                d = `M ${sx} ${sy} L ${ex} ${midY} L ${ex} ${ey}`;
            } else {
                d = `M ${fp.cx} ${fp.cy} L ${tp.cx} ${tp.cy}`;
            }

            const path = makePath(d);
            if (edge.style === 'dashed') {
                path.setAttribute('stroke', '#f59e0b');
                path.setAttribute('stroke-dasharray', '6,4');
            }
            edgesSvg.appendChild(path);

            if (edge.label) {
                // Place label on the horizontal segment of the elbow, offset from the line
                let lx, ly;
                if (edge.type === 'elbow_left') {
                    const [sx, sy] = fp.left;
                    const [ex, ey] = tp.top;
                    lx = (sx + ex) / 2;
                    ly = sy - 20; // above the horizontal line
                } else if (edge.type === 'elbow_right') {
                    const [sx, sy] = fp.right;
                    const [ex, ey] = tp.top;
                    lx = (sx + ex) / 2;
                    ly = sy - 20; // above the horizontal line
                } else {
                    const [sx, sy] = fp.bottom;
                    const [ex, ey] = tp.top;
                    lx = (sx + ex) / 2 + 10;
                    ly = (sy + ey) / 2;
                }
                makeLabel(edgesSvg, edge.label, lx, ly);
            }
        });

        // Controls
        updateTransform();
    }

    function updateTransform() {
        const nodesLayer = document.getElementById('nodes-layer');
        const edgesSvg = document.getElementById('edges-svg');
        if (!nodesLayer || !edgesSvg) return;
        const t = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        nodesLayer.style.transform = t;
        edgesSvg.style.transform = t;
        if (flowchartContainer) flowchartContainer.style.backgroundPosition = `${translateX}px ${translateY}px`;
    }

    // Event Listeners for Panning/Zooming
    flowchartContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (e.ctrlKey) scale = Math.min(Math.max(scale + (e.deltaY > 0 ? -0.05 : 0.05), 0.3), 2);
        else { translateX -= e.deltaX; translateY -= e.deltaY; }
        updateTransform();
    }, { passive: false });

    flowchartContainer.addEventListener('mousedown', (e) => {
        if (e.target.closest('.flow-node') || e.target.closest('.controls')) return;
        isDragging = true; dragStartX = e.clientX - translateX; dragStartY = e.clientY - translateY;
        flowchartContainer.style.cursor = 'grabbing';
    });
    window.addEventListener('mousemove', (e) => { if (isDragging) { translateX = e.clientX - dragStartX; translateY = e.clientY - dragStartY; updateTransform(); } });
    window.addEventListener('mouseup', () => { isDragging = false; flowchartContainer.style.cursor = 'grab'; });

    document.getElementById('zoom-in').addEventListener('click', () => { scale = Math.min(scale + 0.1, 2); updateTransform(); });
    document.getElementById('zoom-out').addEventListener('click', () => { scale = Math.max(scale - 0.1, 0.3); updateTransform(); });
    document.getElementById('reset-view').addEventListener('click', () => { scale = 0.55; translateX = 60; translateY = 40; updateTransform(); });

    // Flowchart Quick Navigation
    const phaseYPositions = {
        '1': 40,
        '2': -1000, // approx -2180 * 0.55 + some offset
        '3': -1600, // approx -3220 * 0.55 + some offset
        '4': -2100  // approx -4120 * 0.55 + some offset
    };
    
    document.querySelectorAll('.flow-nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Update active state
            document.querySelectorAll('.flow-nav-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            // Pan to phase
            const phase = e.target.getAttribute('data-phase');
            if (phaseYPositions[phase] !== undefined) {
                scale = 0.55; // Reset scale for consistent view
                translateX = 60;
                translateY = phaseYPositions[phase];
                
                // Add smooth transition just for this pan
                const nodesLayer = document.getElementById('nodes-layer');
                const edgesSvg = document.getElementById('edges-svg');
                nodesLayer.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                edgesSvg.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                
                updateTransform();
                
                // Remove transition so normal drag/zoom isn't delayed
                setTimeout(() => {
                    nodesLayer.style.transition = '';
                    edgesSvg.style.transition = '';
                }, 500);
            }
        });
    });
    // Close flow-detail-panel when clicking flowchart background
    flowchartContainer.addEventListener('click', (e) => {
        if (!e.target.closest('.flow-node') && !e.target.closest('.flow-detail-panel') && !e.target.closest('.controls')) {
            fdPanel.classList.remove('visible');
            document.querySelectorAll('.flow-node.active').forEach(n => n.classList.remove('active'));
        }
    });


    // ─── Comparison Tables ────────────────────────────────────────────
    function renderCompare(id) {
        const data = compareData[id];
        if (!data) return;
        const container = document.getElementById('compare-content');
        document.querySelector('.main-content').scrollTop = 0;

        let html = `<div class="compare-header animate-fade-in">
            <div class="compare-icon-wrap"><i class="ph ${data.icon}"></i></div>
            <h1>${data.title}</h1>
            <p>${data.subtitle}</p>
        </div>`;

        if (data.note) {
            html += `<div class="compare-note animate-fade-in"><i class="ph-fill ph-warning-circle"></i><span>${data.note}</span></div>`;
        }

        if (data.type === 'three-column') {
            html += `<div class="compare-table three-col animate-fade-in">
                <div class="ct-header-row">
                    <div class="ct-criteria-header"><i class="ph ph-list-checks"></i> เกณฑ์เปรียบเทียบ</div>
                    <div class="ct-col-header" style="--col-color: ${data.colorA}"><span class="ct-col-dot" style="background:${data.colorA}"></span>${data.labelA}</div>
                    <div class="ct-col-header" style="--col-color: ${data.colorB}"><span class="ct-col-dot" style="background:${data.colorB}"></span>${data.labelB}</div>
                    <div class="ct-col-header" style="--col-color: ${data.colorC}"><span class="ct-col-dot" style="background:${data.colorC}"></span>${data.labelC}</div>
                </div>`;
            data.rows.forEach((row, i) => {
                html += `<div class="ct-row ${row.highlight ? 'highlight' : ''}" style="animation-delay: ${i * 0.05}s">
                    <div class="ct-criteria"><i class="ph ${row.icon}"></i>${row.criteria}</div>
                    <div class="ct-cell" style="--col-color: ${data.colorA}">${row.a}</div>
                    <div class="ct-cell" style="--col-color: ${data.colorB}">${row.b}</div>
                    <div class="ct-cell" style="--col-color: ${data.colorC}">${row.c}</div>
                </div>`;
            });
            html += `</div>`;
        } else {
            html += `<div class="compare-table two-col animate-fade-in">
                <div class="ct-header-row">
                    <div class="ct-criteria-header"><i class="ph ph-list-checks"></i> เกณฑ์เปรียบเทียบ</div>
                    <div class="ct-col-header" style="--col-color: ${data.colorLeft}"><span class="ct-col-dot" style="background:${data.colorLeft}"></span>${data.labelLeft}</div>
                    <div class="ct-col-header" style="--col-color: ${data.colorRight}"><span class="ct-col-dot" style="background:${data.colorRight}"></span>${data.labelRight}</div>
                </div>`;
            data.rows.forEach((row, i) => {
                html += `<div class="ct-row ${row.highlight ? 'highlight' : ''}" style="animation-delay: ${i * 0.05}s">
                    <div class="ct-criteria"><i class="ph ${row.icon}"></i>${row.criteria}</div>
                    <div class="ct-cell" style="--col-color: ${data.colorLeft}">${row.left}</div>
                    <div class="ct-cell" style="--col-color: ${data.colorRight}">${row.right}</div>
                </div>`;
            });
            html += `</div>`;
        }

        if (data.relatedLaws) {
            html += `<div class="laws-container compare-laws animate-fade-in"><span class="laws-label">มาตราที่เกี่ยวข้อง:</span>${data.relatedLaws.map(l => `<span class="law-tag">${l}</span>`).join('')}</div>`;
        }

        container.innerHTML = html;
    }

    renderSidebar();
    renderTimeline();
});
