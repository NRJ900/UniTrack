// SRM Data Extraction Script for UniTrack
// Copy and paste this into the browser console on the SRM Student Portal (Grades/Attendance page)

(function () {
    console.log("UniTrack Extraction Script Started...");

    function extractData() {
        const subjects = [];
        const semesters = [];

        // Helper to clean text
        const clean = (text) => text ? text.innerText.trim() : '';

        // Strategy 1: Look for standard tables with headers
        const tables = document.querySelectorAll('table');

        tables.forEach(table => {
            const headers = Array.from(table.querySelectorAll('th')).map(th => th.innerText.trim().toLowerCase());

            // Check for Course/Grade table
            const courseIndex = headers.findIndex(h => h.includes('course') || h.includes('subject') || h.includes('code'));
            const creditIndex = headers.findIndex(h => h.includes('credit'));
            const gradeIndex = headers.findIndex(h => h.includes('grade') || h.includes('result'));

            if (courseIndex !== -1 && gradeIndex !== -1) {
                console.log("Found potential grade table...");
                const rows = table.querySelectorAll('tbody tr');
                rows.forEach((row, index) => {
                    const cells = row.querySelectorAll('td');
                    if (cells.length > Math.max(courseIndex, gradeIndex)) {
                        const creditText = creditIndex !== -1 ? clean(cells[creditIndex]) : '3';
                        const grade = clean(cells[gradeIndex]);
                        const courseText = courseIndex !== -1 ? clean(cells[courseIndex]) : '';

                        // Basic validation to ensure it looks like a grade row
                        if (grade && grade.length <= 2 && /^[OABCDEFPSW]+$/.test(grade)) {
                            subjects.push({
                                id: subjects.length + 1,
                                name: courseText,
                                credit: parseFloat(creditText) || 3,
                                grade: grade
                            });
                        }
                    }
                });
            }
        });

        if (subjects.length === 0) {
            alert('No course data found! Please navigate to the "Grades" or "Academic History" page and try again.');
            return;
        }

        const data = { subjects };
        const json = JSON.stringify(data, null, 2);

        // Copy to clipboard
        navigator.clipboard.writeText(json).then(() => {
            alert('Success! Data copied to clipboard.\n\nNow go to UniTrack and click "Import Data".');
        }).catch(err => {
            console.error('Failed to copy: ', err);
            // Fallback
            const textArea = document.createElement("textarea");
            textArea.value = json;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("Copy");
            textArea.remove();
            alert('Success! Data copied to clipboard.\n\nNow go to UniTrack and click "Import Data".');
        });
    }

    extractData();
})();
