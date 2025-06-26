import { NextResponse, NextRequest } from 'next/server';
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";

//export const config = { runtime: 'edge' };

Amplify.configure(outputs);

const client = generateClient<Schema>();
const models = client.models 

// GET: GraphQL の observeQuery を使用し、Invoice を ID でフィルタして取得
export async function GET(request: NextRequest, { params }: { params: Promise<{ Id: string }> }) {
  const id = (await params).Id;
  return new Promise<Response>((resolve, reject) => {
    const subscription = models.Invoices.observeQuery({ filter: { InvoiceID: { eq: id } } })
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

// PUT: GraphQL ミューテーションを使用して、Invoice を更新
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const body = await request.json();
    console.log("Received PUT request for Invoice ID:", id, "with data:", body);
    const result = await models.Invoices.update({InvoiceID:id, ...body});
    return NextResponse.json({ result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: GraphQL ミューテーションを使用して、Invoice を削除
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    console.log("Received DELETE request for Invoice ID:", params);
    const id = (await params).id;
    console.log("Deleting Invoice with ID:", id);
    const result = await models.Invoices.delete({InvoiceID:id});
    return NextResponse.json({ result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}