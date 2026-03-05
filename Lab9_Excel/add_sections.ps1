# PowerShell script to add Quantitative Data and Team Collaboration sections to the docx

$docxPath = "C:\Users\stani\.gemini\antigravity\scratch\Lab9_Excel\Production management - ceramic mug.docx"
$extractPath = "C:\Users\stani\.gemini\antigravity\scratch\Lab9_Excel\docx_extract"
$outputPath = "C:\Users\stani\.gemini\antigravity\scratch\Lab9_Excel\Production management - ceramic mug - updated.docx"

# Read the document.xml
$xmlPath = Join-Path $extractPath "word\document.xml"
[xml]$doc = Get-Content $xmlPath -Encoding UTF8

# Get the Word namespace
$ns = New-Object System.Xml.XmlNamespaceManager($doc.NameTable)
$ns.AddNamespace("w", "http://schemas.openxmlformats.org/wordprocessingml/2006/main")

# Find the body element
$body = $doc.SelectSingleNode("//w:body", $ns)

# Create the new content as XML fragments
$quantitativeDataSection = @"
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:pPr><w:pStyle w:val="Heading1"/></w:pPr>
    <w:r><w:t>8. Quantitative Data</w:t></w:r>
</w:p>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:r><w:t>This section summarizes the key quantitative parameters and targets defined throughout the production process for ceramic mugs.</w:t></w:r>
</w:p>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:pPr><w:pStyle w:val="Heading2"/></w:pPr>
    <w:r><w:t>8.1 Product Specifications</w:t></w:r>
</w:p>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:r><w:t>The following table presents the dimensional specifications for standard ceramic mugs produced in our facility:</w:t></w:r>
</w:p>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="34"/></w:numPr></w:pPr>
    <w:r><w:t>Capacity: 300-350 ml (standard size)</w:t></w:r>
</w:p>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="34"/></w:numPr></w:pPr>
    <w:r><w:t>Height: 90-100 mm</w:t></w:r>
</w:p>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="34"/></w:numPr></w:pPr>
    <w:r><w:t>Outer Diameter: 80-85 mm</w:t></w:r>
</w:p>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="34"/></w:numPr></w:pPr>
    <w:r><w:t>Wall Thickness: 4-6 mm</w:t></w:r>
</w:p>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="34"/></w:numPr></w:pPr>
    <w:r><w:t>Handle Width: 30-35 mm</w:t></w:r>
</w:p>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="34"/></w:numPr></w:pPr>
    <w:r><w:t>Handle Thickness: 8-12 mm</w:t></w:r>
</w:p>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="34"/></w:numPr></w:pPr>
    <w:r><w:t>Total Weight: 350-450 g</w:t></w:r>
</w:p>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="34"/></w:numPr></w:pPr>
    <w:r><w:t>Base Diameter: 60-65 mm</w:t></w:r>
</w:p>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:pPr><w:pStyle w:val="Heading2"/></w:pPr>
    <w:r><w:t>8.2 Process Parameters</w:t></w:r>
</w:p>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:r><w:t>Critical temperature and time parameters for each production stage:</w:t></w:r>
</w:p>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="34"/></w:numPr></w:pPr>
    <w:r><w:t>Bisque Firing Temperature: 900-1060 degrees Celsius</w:t></w:r>
</w:p>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="34"/></w:numPr></w:pPr>
    <w:r><w:t>Glaze Firing Temperature: above 1200 degrees Celsius</w:t></w:r>
</w:p>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="34"/></w:numPr></w:pPr>
    <w:r><w:t>Bisque Firing Duration: 8-12 hours (including heating and cooling)</w:t></w:r>
</w:p>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="34"/></w:numPr></w:pPr>
    <w:r><w:t>Glaze Firing Duration: 10-14 hours (including heating and cooling)</w:t></w:r>
</w:p>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="34"/></w:numPr></w:pPr>
    <w:r><w:t>Controlled Drying Time: 24-48 hours (depending on humidity)</w:t></w:r>
</w:p>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="34"/></w:numPr></w:pPr>
    <w:r><w:t>Clay Moisture Content at Forming: 20-25%</w:t></w:r>
</w:p>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="34"/></w:numPr></w:pPr>
    <w:r><w:t>Bone-Dry Moisture Content: less than 1%</w:t></w:r>
</w:p>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:pPr><w:pStyle w:val="Heading2"/></w:pPr>
    <w:r><w:t>8.3 Key Performance Indicators (KPIs)</w:t></w:r>
</w:p>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:r><w:t>Target values for production efficiency and quality control:</w:t></w:r>
</w:p>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="34"/></w:numPr></w:pPr>
    <w:r><w:t>First Pass Yield (FPY): at least 92% - mugs passing final inspection without rework</w:t></w:r>
</w:p>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="34"/></w:numPr></w:pPr>
    <w:r><w:t>Cycle Time (Shaping): 45 seconds per mug body (automated slip casting/jiggering)</w:t></w:r>
</w:p>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="34"/></w:numPr></w:pPr>
    <w:r><w:t>Kiln Utilization: at least 95% of kiln volume used per firing cycle</w:t></w:r>
</w:p>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="34"/></w:numPr></w:pPr>
    <w:r><w:t>Defect Rate (Post-Firing): less than 3% - cracks, glaze defects, or deformations</w:t></w:r>
</w:p>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="34"/></w:numPr></w:pPr>
    <w:r><w:t>On-Time Delivery Rate: at least 98% of orders shipped within committed window</w:t></w:r>
</w:p>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="34"/></w:numPr></w:pPr>
    <w:r><w:t>Machine Downtime: less than 2% of total scheduled production time</w:t></w:r>
</w:p>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="34"/></w:numPr></w:pPr>
    <w:r><w:t>Daily Production Capacity: 2000-3000 mugs per 8-hour shift</w:t></w:r>
</w:p>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="34"/></w:numPr></w:pPr>
    <w:r><w:t>Kiln Batch Size: 200-500 mugs per firing cycle</w:t></w:r>
</w:p>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:pPr><w:pStyle w:val="Heading2"/></w:pPr>
    <w:r><w:t>8.4 Material Consumption</w:t></w:r>
</w:p>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:r><w:t>Estimated material requirements per mug:</w:t></w:r>
</w:p>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="34"/></w:numPr></w:pPr>
    <w:r><w:t>Clay Body: 400-500 g (before drying shrinkage of 10-15%)</w:t></w:r>
</w:p>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="34"/></w:numPr></w:pPr>
    <w:r><w:t>Glaze Application: 30-50 ml per mug</w:t></w:r>
</w:p>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="34"/></w:numPr></w:pPr>
    <w:r><w:t>Energy Consumption (per mug): 0.8-1.2 kWh for firing processes</w:t></w:r>
</w:p>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"/>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:pPr><w:pStyle w:val="Heading1"/></w:pPr>
    <w:r><w:t>9. Team Collaboration</w:t></w:r>
</w:p>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:r><w:t>This report was developed collaboratively by a diverse, international team of five students. The work was divided according to the 5Ps framework to ensure comprehensive coverage of all aspects of ceramic mug production management.</w:t></w:r>
</w:p>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:pPr><w:pStyle w:val="Heading2"/></w:pPr>
    <w:r><w:t>9.1 Task Distribution</w:t></w:r>
</w:p>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:r><w:t>Our team organized the work through a shared communication channel where sections were assigned based on individual strengths and interests. The project was initiated on 21 January 2026 when the team established the section structure and agreed on responsibilities. The division of responsibilities was as follows:</w:t></w:r>
</w:p>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="34"/></w:numPr></w:pPr>
    <w:r><w:t>Maciej Gara (257093): Introduction, Product, People, and Summary sections</w:t></w:r>
</w:p>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="34"/></w:numPr></w:pPr>
    <w:r><w:t>Stanislaw Kotowicz (257100): Process section</w:t></w:r>
</w:p>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="34"/></w:numPr></w:pPr>
    <w:r><w:t>Michal Ogluszka (257104): Plant section</w:t></w:r>
</w:p>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="34"/></w:numPr></w:pPr>
    <w:r><w:t>Sofia Neves (905422): Programme section - Production Scheduling and Resource Allocation</w:t></w:r>
</w:p>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="34"/></w:numPr></w:pPr>
    <w:r><w:t>Ana Carvalho (905431): Programme section - Performance Monitoring and KPI Management</w:t></w:r>
</w:p>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:pPr><w:pStyle w:val="Heading2"/></w:pPr>
    <w:r><w:t>9.2 Collaborative Approach</w:t></w:r>
</w:p>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:r><w:t>Communication was maintained through a group messaging platform, allowing for real-time coordination and feedback exchange. Each member contributed their expertise to their assigned sections. The Introduction and Product sections provided the foundational context for the production analysis. The Process section detailed the step-by-step manufacturing workflow from raw materials to final packaging. The Plant section covered facility design, equipment requirements, factory layout, and safety measures. The Programme section addressed production scheduling strategies, resource allocation using pull systems and Kanban techniques, and performance monitoring through KPIs. The People and Summary sections concluded the report by outlining workforce requirements and synthesizing the key findings.</w:t></w:r>
</w:p>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:pPr><w:pStyle w:val="Heading2"/></w:pPr>
    <w:r><w:t>9.3 Integration and Quality Assurance</w:t></w:r>
</w:p>
<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:r><w:t>To ensure consistency across all sections, the team conducted reviews of each other's contributions and aligned formatting, terminology, and style. The final document represents a unified effort that demonstrates the practical application of the 5Ps framework to real-world production management.</w:t></w:r>
</w:p>
"@

Write-Host "Script created. New sections will be added to the document."
Write-Host "The content includes:"
Write-Host "- Section 8: Quantitative Data (Product Specs, Process Params, KPIs, Material Consumption)"
Write-Host "- Section 9: Team Collaboration (Task Distribution, Collaborative Approach, Integration)"
