// Example decorator.  I don't need this anymore, but having it as a sample will help me remember how to create them.
// export const ApiCreatedDto = <TModel extends Type>(model: TModel) => {
//   return applyDecorators(
//     ApiCreatedResponse({
//       schema: {
//         allOf: [
//           { $ref: getSchemaPath(CreatedDto) },
//           {
//             properties: {
//               body: {
//                 $ref: getSchemaPath(model),
//               },
//             },
//           },
//         ],
//       },
//     }),
//   )
// }
