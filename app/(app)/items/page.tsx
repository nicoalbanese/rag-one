import { Suspense } from "react";

import Loading from "@/app/loading";
import ItemList from "@/components/items/ItemList";
import { getItems } from "@/lib/api/items/queries";


export const revalidate = 0;

export default async function ItemsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Knowledge</h1>
        </div>
        <Items />
      </div>
    </main>
  );
}

const Items = async () => {
  
  const { items } = await getItems();
  
  return (
    <Suspense fallback={<Loading />}>
      <ItemList items={items}  />
    </Suspense>
  );
};
