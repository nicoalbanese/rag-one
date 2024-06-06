
import { type Item, type CompleteItem } from "@/lib/db/schema/items";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Item>) => void;

export const useOptimisticItems = (
  items: CompleteItem[],
  
) => {
  const [optimisticItems, addOptimisticItem] = useOptimistic(
    items,
    (
      currentState: CompleteItem[],
      action: OptimisticAction<Item>,
    ): CompleteItem[] => {
      const { data } = action;

      

      const optimisticItem = {
        ...data,
        
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticItem]
            : [...currentState, optimisticItem];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticItem } : item,
          );
        case "delete":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, id: "delete" } : item,
          );
        default:
          return currentState;
      }
    },
  );

  return { addOptimisticItem, optimisticItems };
};
