import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export let capabilityAreas: any,
  responsibilityLevelsData: any,
  levelOneQuestions: any,
  levelTwoQuestions: any,
  cellDefinitions: any;

export async function loadData() {
  try {
    [
      capabilityAreas,
      responsibilityLevelsData,
      levelOneQuestions,
      levelTwoQuestions,
      cellDefinitions,
    ] = await Promise.all([
      readJSONFile("framework.json"),
      readResponsibilityLevelsData(),
      readLevelOneQuestions(),
      readLevelTwoQuestions(),
      readCellDefinitions(),
    ]);

    //console.log("Loaded level one questions:", levelOneQuestions.length);

    if (!responsibilityLevelsData || responsibilityLevelsData.length === 0) {
      throw new Error(
        "Responsibility levels data is empty or not loaded correctly"
      );
    }

    preprocessCapabilityAreas();
  } catch (error) {
    console.error("Error loading data:", error);
    throw error;
  }
}

async function readJSONFile(filename: string) {
  const filePath = path.join(__dirname, "../data", filename);
  const rawData = await fs.readFile(filePath, "utf8");
  return JSON.parse(rawData);
}

export async function readResponsibilityLevelsData() {
  const data = await readJSONFile("responsibility_level.json");

  return data;
}

export async function readLevelOneQuestions() {
  const questions = await readJSONFile("ask_questions.json");
  console.log("Raw level one questions:", questions.length);
  const processedQuestions = questions.flatMap(processLevelOneQuestion);
  console.log("Processed level one questions:", processedQuestions.length);
  // console.log(
  //   "Sample processed question:",
  //   JSON.stringify(processedQuestions[0], null, 2)
  // );
  // console.log("Unique levels in questions:", [
  //   ...new Set(processedQuestions.map((q) => q.Lvl)),
  // ]);
  return processedQuestions;
}

function processLevelOneQuestion(question: any) {
  const capabilities = [
    "Building a Team",
    "Developing Others",
    "Leading a Team to Get Results",
    "Managing Performance",
    "Managing the Business",
    "Personal Development",
    "Communicating as a Leader",
    "Creating the Environment",
  ];

  const processedQuestions: any[] = [];

  capabilities.forEach((capability) => {
    const skillKey = Object.keys(question).find(
      (key) => key.includes(capability) && key.includes("(Skill)")
    );
    const confidenceKey = Object.keys(question).find(
      (key) => key.includes(capability) && key.includes("(Confidence)")
    );

    if (skillKey && confidenceKey) {
      processedQuestions.push({
        capability: capability,
        Lvl: question.Lvl,
        "Role Name": question[" Role Name"],
        question: question[skillKey],
        ratingQuestion: question[skillKey],
        reflection: question[confidenceKey],
      });
    }
  });

  return processedQuestions;
}

export async function readLevelTwoQuestions() {
  const questions = await readJSONFile("get_questions.json");
  console.log("Loaded level two questions:", questions.length);
  return questions;
}

export async function readCellDefinitions() {
  const cellDefinitions = await readJSONFile("framework_defination.json");
  return cellDefinitions.map(processCellDefinition);
}

export const processQuestion = (question: any) => {
  const processedQuestion: any = {};

  for (const [key, value] of Object.entries(question)) {
    const trimmedKey = key.trim();
    if (
      trimmedKey === "Lvl" ||
      trimmedKey === "Role Name" ||
      trimmedKey === "Description"
    ) {
      processedQuestion[trimmedKey] =
        typeof value === "string" ? value.trim() : value;
    } else {
      const [category, type] = trimmedKey.split("(");
      const categoryKey = category.trim();
      const typeKey = type ? type.replace(")", "").trim() : "General";

      if (!processedQuestion[categoryKey]) {
        processedQuestion[categoryKey] = {};
      }

      if (typeof value === "string") {
        const [ratingQuestion, ...reflectionParts] = value.split("\n\n");

        processedQuestion[categoryKey][typeKey] = {
          ratingQuestion: ratingQuestion.trim(),
          reflection: reflectionParts.join("\n\n").trim(),
        };
      } else {
        processedQuestion[categoryKey][typeKey] = value;
      }
    }
  }

  return processedQuestion;
};

export const processLevel = (level: any) => {
  const processedLevel: any = {};

  for (const [key, value] of Object.entries(level)) {
    const trimmedKey = key.trim();

    if (["Lvl", "Role Name", "Description"].includes(trimmedKey)) {
      processedLevel[trimmedKey] =
        typeof value === "string" ? value.trim() : value;
    } else {
      processedLevel[trimmedKey] = processThemesAndFocusAreas(value);
    }
  }

  return processedLevel;
};

export const processCellDefinition = (cellDef: any) => {
  const processedCellDef: any = {};

  for (const [key, value] of Object.entries(cellDef)) {
    const trimmedKey = key.trim();

    if (trimmedKey === "Lvl") {
      processedCellDef[trimmedKey] = parseInt(value, 10);
    } else {
      processedCellDef[trimmedKey] =
        typeof value === "string" ? value.trim() : value;
    }
  }

  return processedCellDef;
};

const processThemesAndFocusAreas = (value: any) => {
  if (typeof value !== "string") return value;

  const lines = value.split("\n");
  const themes = [];
  let currentTheme = "";

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith("Themes or Focus Areas:")) continue;
    if (trimmedLine === "") continue;

    if (trimmedLine.endsWith(":")) {
      if (currentTheme) themes.push(currentTheme);
      currentTheme = trimmedLine.slice(0, -1);
    } else {
      if (currentTheme) {
        currentTheme += " " + trimmedLine;
      } else {
        themes.push(trimmedLine);
      }
    }
  }

  if (currentTheme) themes.push(currentTheme);

  return themes;
};

export const capabilityAreasByLevel = {};

function preprocessCapabilityAreas() {
  if (!Array.isArray(capabilityAreas) || capabilityAreas.length === 0) {
    // console.warn("capabilityAreas is empty or not an array");
    return;
  }

  //console.log("Processing capability areas...");

  capabilityAreas.forEach((area) => {
    if (!area || typeof area !== "object") {
      //console.warn("Invalid area object:", area);
      return;
    }

    const level = area["Target Audience"];
    if (!level || typeof level !== "string") {
      //console.warn("Invalid Target Audience for area:", JSON.stringify(area));
      return;
    }

    const trimmedLevel = level.trim();
    if (trimmedLevel === "") {
      // console.warn("Empty Target Audience for area:", JSON.stringify(area));
      return;
    }

    if (!capabilityAreasByLevel[trimmedLevel]) {
      capabilityAreasByLevel[trimmedLevel] = [];
    }
    capabilityAreasByLevel[trimmedLevel].push(Object.keys(area)[0]);
  });

  //console.log(
  // "Processed capability areas:",
  // Object.keys(capabilityAreasByLevel)
  //);
}
