const title = process.argv.slice(2).join(' ').replace(/^--\s*/, '').trim() || 'StockLens feature task';
const today = new Date().toISOString().slice(0, 10);

const brief = `# ${title}

Date: ${today}

## Goal
- 

## Affected Routes
- 

## Acceptance Criteria
- 

## Risk Areas
- Layout readability
- Client/server secret boundary
- Financial advice disclaimer
- Vercel production build

## Nex Secondary Agent Prompt
Provide one draft approach, one alternative approach, likely tests, and risks. Do not make final architecture, security, finance, or deployment decisions.
`;

console.log(brief);
