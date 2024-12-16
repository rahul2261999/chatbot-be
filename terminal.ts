import inquirer from "inquirer";
import rag from "./llm/rag/rag";
import { Command } from "commander";

class Terminal {
  public static instance: Terminal;

  private constructor() {}

  public static getInstance(): Terminal {
    if (!Terminal.instance) {
      Terminal.instance = new Terminal();
    }

    return Terminal.instance;
  }

  private async initInteractiveMode() {
    try {
      console.log("Welcome to the RAG CLI Application!");
      console.log("Type 'exit' to close the terminal.");

      while (true) {
        const prompt = await inquirer.prompt([
          {
            type: "input",
            name: "question",
            message: "Ask a question:"
          }
        ]);

        if (prompt.question.toLowerCase() === "exit") {
          console.log("Closing the terminal...");
          break;
        }

        const answer = await rag.askQuestion(prompt.question);

        console.log(`Answer: ${answer}`);
      }
    } catch (error) {
      console.error("Error occurred:", error);
      throw new Error("Something went wrong");
    }
  }

  public init() {
    console.log("Starting interactive terminal...");
    const program = new Command();

    program
      .command("interactive")
      .description("Run the CLI in interactive mode")
      .action(async () => {
        await this.initInteractiveMode();
      });

    program.parse(process.argv);
  }
}

// Initialize the terminal
const terminal = Terminal.getInstance();
terminal.init();
