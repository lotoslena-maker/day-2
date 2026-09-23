const task = document.querySelector('#task');
const output = document.querySelector('#output');
const runButton = document.querySelector('#run-agent');
const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#navigation');
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menu.classList.toggle('is-open', open);
});
function closeMenu() { menu.classList.remove('is-open'); menuButton.setAttribute('aria-expanded', 'false'); }
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu.classList.contains('is-open')) { closeMenu(); menuButton.focus(); } });
document.querySelectorAll('.example').forEach(button => button.addEventListener('click', () => { task.value = button.dataset.task; task.removeAttribute('aria-invalid'); task.focus(); }));
task.addEventListener('input', () => task.removeAttribute('aria-invalid'));
document.querySelector('#agent-form').addEventListener('submit', async event => {
  event.preventDefault();
  if (runButton.disabled) return;
  const goal = task.value.trim();
  output.replaceChildren();
  if (!goal) { output.textContent = 'Please enter a task or choose an example.'; task.setAttribute('aria-invalid', 'true'); task.focus(); return; }
  runButton.disabled = true;
  runButton.textContent = 'Simulating…';
  const steps = [
    ['01 / Understand the goal', `Your goal: ${goal}`],
    ['02 / Create a plan', 'Define the expected deliverable. Gather the relevant information. Break the work into small, verifiable steps.'],
    ['03 / Choose tools', 'A connected agent could use search for sources, files for context, and an editor to prepare the result. This simulator does not call tools.'],
    ['04 / Evaluate the result', 'Check the deliverable against the original goal, review accuracy, and identify anything that needs human input.'],
    ['Simulation complete', 'This is an illustrative workflow, not a completed task or an AI-generated answer. No data was sent to an AI service.']
  ];
  try {
    for (const [title, description] of steps) {
      await new Promise(resolve => setTimeout(resolve, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 650));
      const row = document.createElement('div'); row.className = 'output-row';
      const heading = document.createElement('strong'); heading.textContent = title;
      const text = document.createElement('p'); text.textContent = description;
      row.append(heading, text); output.append(row);
    }
  } finally { runButton.disabled = false; runButton.textContent = 'Run again ↗'; }
});
