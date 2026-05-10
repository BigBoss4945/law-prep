import sys

with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Update showView
old_showview = '''    function showView(view, data = null) {
        timelineContainer.style.display = 'none';
        contentArea.style.display = 'none';
        pdfContainer.style.display = 'none';
        if (flowchartContainer) flowchartContainer.style.display = 'none';

        if (view === 'timeline') {
            timelineContainer.style.display = 'block';
        } else if (view === 'flowchart') {'''

new_showview = '''    function showView(view, data = null) {
        timelineContainer.style.display = 'none';
        contentArea.style.display = 'none';
        pdfContainer.style.display = 'none';
        if (mindmapContainer) mindmapContainer.style.display = 'none';
        if (flowchartContainer) flowchartContainer.style.display = 'none';

        if (view === 'timeline') {
            timelineContainer.style.display = 'block';
        } else if (view === 'mindmap') {
            mindmapContainer.style.display = 'block';
            renderMindmap();
        } else if (view === 'flowchart') {'''

content = content.replace(old_showview, new_showview)

# Also update the sidebar logic to handle 'mindmap'
old_sidebar_logic = '''                btn.addEventListener('click', () => {
                    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
                    btn.classList.add('active');

                    if (item.id === 'timeline') showView('timeline');
                    else if (item.id === 'flowchart') showView('flowchart');
                    else if (cat.id === 'exams_pdf') {
                        showView('pdf', item);
                    }
                    else { renderContent(item.id); showView('content'); }
                });'''

new_sidebar_logic = '''                btn.addEventListener('click', () => {
                    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
                    btn.classList.add('active');

                    if (item.id === 'timeline') showView('timeline');
                    else if (item.id === 'mindmap') showView('mindmap');
                    else if (item.id === 'flowchart') showView('flowchart');
                    else if (cat.id === 'exams_pdf') {
                        showView('pdf', item);
                    }
                    else { renderContent(item.id); showView('content'); }
                });'''

content = content.replace(old_sidebar_logic, new_sidebar_logic)

# Insert renderMindmap just before renderTimeline
old_render_timeline = '''    // ─── Timeline ────────────────────────────────────────────────────'''

new_render_mindmap = '''    // ─── Mindmap ─────────────────────────────────────────────────────
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

    // ─── Timeline ────────────────────────────────────────────────────'''

content = content.replace(old_render_timeline, new_render_mindmap)

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("script.js patched for mindmap view.")
