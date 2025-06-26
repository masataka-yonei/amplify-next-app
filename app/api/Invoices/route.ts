import { NextRequest, NextResponse } from 'next/server';
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";

//export const config = { runtime: 'edge' };

Amplify.configure(outputs);

const client = generateClient<Schema>();
const models = client.models 

// GET リクエストハンドラ: GraphQL の observeQuery を使い、全ての Invoices レコードを取得
export async function GET() {
  return new Promise<Response>((resolve, reject) => {
    const subscription = models.Invoices.observeQuery({ })
      .subscribe({
        next: (snapshot: any) => {
          subscription.unsubscribe();
          resolve(NextResponse.json(snapshot.items));
        },
        error: (error: any) => {
          reject(NextResponse.json({ error: error.message }, { status: 500 }));
        }
      });
  });
}

// POST リクエストハンドラ: GraphQL ミューテーションを使い、Invoice レコードを作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received Invoice data:", body);
    
    const invoiceData = {
      InvoiceID: body.InvoiceID,
      BillNo: body.BillNo,
      SlipNo: body.SlipNo,
      CustomerID: body.CustomerID,
      CustomerName: body.CustomerName,
      Products: body.Products,
      Number: body.Number,
      UnitPrice: body.UnitPrice,
      Date: body.Date,
    };    
    const result = await models.Invoices.create(invoiceData);
    console.log("Invoice created result:", result);
    return NextResponse.json({ result });
  } catch (error: any) {
    console.error("Error creating Invoice:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}