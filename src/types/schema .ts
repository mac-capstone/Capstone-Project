// // schemas.ts
// import { z } from 'zod';

// /** ---------- Branded ID schemas ---------- */
// export const UserId = z.string().brand<'UserIdT'>();
// export type UserIdT = z.infer<typeof UserId>;

// export const ExpenseId = z.string().brand<'ExpenseIdT'>();
// export type ExpenseIdT = z.infer<typeof ExpenseId>;

// export const ItemId = z.string().brand<'ItemIdT'>();
// export type ItemIdT = z.infer<typeof ItemId>;

// export const PersonId = z.string().brand<'PersonIdT'>();
// export type PersonIdT = z.infer<typeof PersonId>;

// /** ---------- Core domain schemas ---------- */
// export const ExpenseSchema = z.object({
//   name: z.string(),
//   totalAmount: z.number(),
//   date: z.string(), // ISO date string
//   remainingAmount: z.number(),
//   createdBy: UserId,
//   itemCount: z.number(),
//   participantCount: z.number(),
// });
// export type Expense = z.infer<typeof ExpenseSchema>;

// export const ItemSchema = z.object({
//   name: z.string(),
//   price: z.number(),
//   personIds: z.array(PersonId),
// });
// export type Item = z.infer<typeof ItemSchema>;

// export const PersonSchema = z.object({
//   name: z.string(),
//   color: z.string(),
//   profilePicUrl: z.string().url().optional(),
// });
// export type Person = z.infer<typeof PersonSchema>;

// /** WithId variants */
// export const ExpenseWithIdSchema = ExpenseSchema.extend({ id: ExpenseId });
// export type ExpenseWithId = z.infer<typeof ExpenseWithIdSchema>;

// export const ItemWithIdSchema = ItemSchema.extend({ id: ItemId });
// export type ItemWithId = z.infer<typeof ItemWithIdSchema>;

// export const PersonWithIdSchema = PersonSchema.extend({ id: PersonId });
// export type PersonWithId = z.infer<typeof PersonWithIdSchema>;

// /** ---------- Mock-data (Firestoreish) shapes ---------- */
// /** These mirror your mockData structure exactly */
// const MockPersonDoc = z.object({
//   name: z.string(),
//   color: z.string(),
//   userRef: z.string().nullable().optional(),
//   subtotal: z.number().optional(),
// });
// const MockPerson = z.object({
//   id: z.string(),
//   doc: MockPersonDoc,
// });

// const MockItemDoc = z.object({
//   name: z.string(),
//   amount: z.number(), // map -> price
//   split: z.object({
//     mode: z.enum(['equal', 'custom']),
//     shares: z.record(z.number()),
//   }),
//   assignedPersonIds: z.array(z.string()), // map -> personIds
// });
// const MockItem = z.object({
//   id: z.string(),
//   doc: MockItemDoc,
// });

// const MockExpenseDoc = z.object({
//   name: z.string(),
//   date: z.string(),
//   createdBy: z.string(), // map -> UserId
//   totalAmount: z.number(),
//   remainingAmount: z.number(),
//   itemCount: z.number(),
//   participantCount: z.number(),
// });
// export const MockExpense = z.object({
//   id: z.string(),
//   doc: MockExpenseDoc,
//   people: z.array(MockPerson),
//   items: z.array(MockItem),
// });
// export type MockExpenseT = z.infer<typeof MockExpense>;

// /** ---------- Transformers from mock -> domain ---------- */
// export function mapMockExpenseToExpense(e: MockExpenseT): ExpenseWithId {
//   const parsed = MockExpense.parse(e); // runtime validation of mock shape

//   return ExpenseWithIdSchema.parse({
//     id: parsed.id as unknown as z.infer<typeof ExpenseId>, // brand
//     name: parsed.doc.name,
//     totalAmount: parsed.doc.totalAmount,
//     date: parsed.doc.date,
//     remainingAmount: parsed.doc.remainingAmount,
//     createdBy: parsed.doc.createdBy as unknown as z.infer<typeof UserId>,
//     itemCount: parsed.doc.itemCount,
//     participantCount: parsed.doc.participantCount,
//   });
// }

// export function mapMockItemToItem(it: z.infer<typeof MockItem>): ItemWithId {
//   const parsed = MockItem.parse(it);
//   return ItemWithIdSchema.parse({
//     id: parsed.id as unknown as z.infer<typeof ItemId>,
//     name: parsed.doc.name,
//     price: parsed.doc.amount,
//     personIds: parsed.doc.assignedPersonIds.map(
//       (pid) => pid as unknown as z.infer<typeof PersonId>
//     ),
//   });
// }

// export function mapMockPersonToPerson(
//   p: z.infer<typeof MockPerson>
// ): PersonWithId {
//   const parsed = MockPerson.parse(p);
//   return PersonWithIdSchema.parse({
//     id: parsed.id as unknown as z.infer<typeof PersonId>,
//     name: parsed.doc.name,
//     color: parsed.doc.color,
//     // profilePicUrl: ... (add if you put it into mock)
//   });
// }
