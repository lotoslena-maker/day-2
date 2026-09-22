function runAgent() {

  const task = document
    .getElementById("task")
    .value
    .trim();

  const output = document
    .getElementById("output");


  if (!task) {

    output.style.display = "block";

    output.innerHTML =
      "⚠️ Please enter a task for the AI agent.";

    return;
  }


  output.style.display = "block";


  output.innerHTML = `

    <strong>
      🤖 AI Agent received the task:
    </strong>

    <br>

    ${escapeHTML(task)}

    <br><br>


    <strong>
      🎯 Step 1 — Understand the Goal
    </strong>

    <br>

    Identify the main objective,
    desired result, and important constraints.

    <br><br>


    <strong>
      🧠 Step 2 — Analyze the Context
    </strong>

    <br>

    Review the available information
    and determine what is needed.

    <br><br>


    <strong>
      🗺️ Step 3 — Build a Plan
    </strong>

    <br>

    Break the task into smaller steps
    and organize the execution sequence.

    <br><br>


    <strong>
      🔧 Step 4 — Select Tools
    </strong>

    <br>

    Choose relevant tools, software,
    models, or data sources.

    <br><br>


    <strong>
      ⚙️ Step 5 — Execute
    </strong>

    <br>

    Perform the planned actions
    step by step.

    <br><br>


    <strong>
      ✅ Step 6 — Evaluate
    </strong>

    <br>

    Check whether the result meets
    the original goal and improve it
    if necessary.

  `;
}


function escapeHTML(text) {

  const div =
    document.createElement("div");

  div.textContent =
    text;

  return div.innerHTML;

}