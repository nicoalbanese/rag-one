"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/items/useOptimisticItems";
import { type Item } from "@/lib/db/schema/items";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import ItemForm from "@/components/items/ItemForm";


export default function OptimisticItem({ 
  item,
   
}: { 
  item: Item; 
  
  
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Item) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticItem, setOptimisticItem] = useOptimistic(item);
  const updateItem: TAddOptimistic = (input) =>
    setOptimisticItem({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <ItemForm
          item={optimisticItem}
          
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateItem}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticItem.content.slice(0,50)}...</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticItem.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticItem, null, 2)}
      </pre>
    </div>
  );
}
