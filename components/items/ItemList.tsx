"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Item, CompleteItem } from "@/lib/db/schema/items";
import Modal from "@/components/shared/Modal";

import { useOptimisticItems } from "@/app/(app)/items/useOptimisticItems";
import { Button } from "@/components/ui/button";
import ItemForm from "./ItemForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (item?: Item) => void;

export default function ItemList({
  items,
   
}: {
  items: CompleteItem[];
   
}) {
  const { optimisticItems, addOptimisticItem } = useOptimisticItems(
    items,
     
  );
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<Item | null>(null);
  const openModal = (item?: Item) => {
    setOpen(true);
    item ? setActiveItem(item) : setActiveItem(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeItem ? "Edit Item" : "Add Knowledge"}
      >
        <ItemForm
          item={activeItem}
          addOptimistic={addOptimisticItem}
          openModal={openModal}
          closeModal={closeModal}
          
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticItems.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticItems.map((item) => (
            <Item
              item={item}
              key={item.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const Item = ({
  item,
  openModal,
}: {
  item: CompleteItem;
  openModal: TOpenModal;
}) => {
  const optimistic = item.id === "optimistic";
  const deleting = item.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("items")
    ? pathname
    : pathname + "/items/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{item.content.slice(0,150)}...</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + item.id }>
          Edit
        </Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No items
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new item.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Items </Button>
      </div>
    </div>
  );
};
