// export interface Calendar{
//     id:number
//     name:string;
// }
//
// export class EditCalendar{
//     public static newCalendar():Calendar{
//         return{
//             id:Math.floor(Math.random()*Number.MAX_SAFE_INTEGER),
//             name:""
//         }
//     }
//     public static fromJSONobj(data:any):Calendar {
//         return Object.assign(EditCalendar.newCalendar(),data);
//     }
// }