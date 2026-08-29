import { Agent, CursorAgentError } from "@cursor/sdk";

const DEFAULT_PROMPT =
  "En una frase, ¿qué es Fleet Care en este repositorio? Resume landing y simulador sin editar archivos.";

async function main() {
  const apiKey = process.env.CURSOR_API_KEY?.trim();
  if (!apiKey) {
    console.error(
      "Missing CURSOR_API_KEY. Set it in .env.local (see .env.example)."
    );
    process.exit(1);
  }

  const message = process.argv.slice(2).join(" ").trim() || DEFAULT_PROMPT;

  try {
    const result = await Agent.prompt(message, {
      apiKey,
      model: { id: "composer-2.5" },
      local: { cwd: process.cwd() },
    });

    console.log(`status: ${result.status}`);
    if (result.result) {
      console.log(result.result);
    }
    if (result.error) {
      console.error(result.error.message);
    }

    if (result.status === "error") {
      process.exit(2);
    }
  } catch (error) {
    if (error instanceof CursorAgentError) {
      console.error(error.message);
      process.exit(1);
    }
    throw error;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
