import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getItemById } from "@/lib/api/items/queries";
import OptimisticItem from "./OptimisticItem";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function ItemPage({
  params,
}: {
  params: { itemId: string };
}) {

  return (
    <main className="overflow-auto">
      <Item id={params.itemId} />
    </main>
  );
}

const Item = async ({ id }: { id: string }) => {
  
  const { item } = await getItemById(id);
  

  if (!item) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="items" />
        <OptimisticItem item={item}  />
      </div>
    </Suspense>
  );
};
