import { pgTable, serial, text, boolean, varchar, json } from "drizzle-orm/pg-core";


export const USER_TABLE=pgTable('users',{
    id:serial().primaryKey(),
    name:text().notNull(),
    email:text().notNull().unique(),
    isMember:boolean().notNull().default(false),
})
// The following tables are temporarily commented out for debugging.

// export const STUDY_MATERIAL_TABLE=pgTable('study_material',{
//     id:serial().primaryKey(),
//     courseId:varchar().notNull(),
//     courseType:varchar().notNull(),
//     topic:varchar().notNull(),
//     difficultyLevel:varchar().default('Easy'),
//     courseLayout:json(),
//     createdBy:varchar().notNull(),
//     status:varchar().default('Generating'),
// })

// export const CHAPTER_NOTES_TABLE= pgTable('chapterNotes',{
//     id:serial().primaryKey(),
//     courseId:varchar().notNull(),
//     chapterId:varchar().notNull(),
//     notes:text()
// })

// export const STUDY_TYPE_CONTENT_TABLE=pgTable('studyTypeContent',{
//     id:serial().primaryKey(),
//     courseId:varchar().notNull(),
//     content:json(),
//     type:varchar().notNull(),
//     status:varchar().default('Generating')
// })

