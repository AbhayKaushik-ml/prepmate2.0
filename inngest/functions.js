import { generateNotes, GenerateStudyTypeContentAiModel } from "@/configs/AiModel";
import { inngest } from "./client";
import { CHAPTER_NOTES_TABLE, STUDY_MATERIAL_TABLE, STUDY_TYPE_CONTENT_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { getDbConnection } from "@/configs/db";

// Define the hello world function that responds to test/hello.world events
export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    console.log("Received event:", event);
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);

export const CreateNewUser = inngest.createFunction(
  { id: 'create-user' },
  { event: 'user.create' },
  async ({ event, step }) => {
    // get Event data
    const result = await step.run('Check User and create New if not in DB', async () => {

    })
  })

export const GenerateNotes = inngest.createFunction(
    { id: 'generate-course' },
    { event: 'notes.generate' },
    async ({ event, step }) => {
        const db = getDbConnection();
        const { course } = event.data; // all record info

        // generate notes for each chapter with AI
        await step.run('Generate Chapter Notes', async () => {
            const chapters = course?.courseLayout?.chapters;
            for (const [index, chapter] of chapters.entries()) {
                const PROMPT = 'Generate exam material detail content for each chapter, Make sure to include all topic points in the content, make sure to give content in HTML format( Do not add HTML, Head, Body, title tag), The chapters:' + JSON.stringify(chapter);
                const result = await generateNotes.sendMessage(PROMPT);
                const aiResp = result.response.text();

                await db.insert(CHAPTER_NOTES_TABLE).values({
                    chapterId: index.toString(),
                    courseId: course?.courseId,
                    notes: aiResp
                });
            }
            return 'Completed';
        });

        // Update Status to 'Ready'
        await step.run('Update Course Status to Ready', async () => {
            await db.update(STUDY_MATERIAL_TABLE).set({
                status: 'Ready'
            }).where(eq(STUDY_MATERIAL_TABLE.courseId, course?.courseId));
            return 'success';
        });
    }
);

// used to generate flashcard and quizz
export const GenerateStudyTypeContent = inngest.createFunction(
    { id: 'Generate Study Type Content' },
    { event: 'studyType.content' },
    async ({ event, step }) => {
        const db = getDbConnection();
        const { prompt, recordId } = event.data;

        const aiResult = await step.run('Generating Content using AI', async () => {
            const result = await GenerateStudyTypeContentAiModel.sendMessage(prompt);
            const aiResponse = JSON.parse(result.response.text());
            return aiResponse;
        });

        await step.run('Save Result to DB', async () => {
            await db.update(STUDY_TYPE_CONTENT_TABLE).set({
                content: aiResult,
                status: 'Ready'
            }).where(eq(STUDY_TYPE_CONTENT_TABLE.id, recordId));
            return 'inserted successfully';
        });
    }
);