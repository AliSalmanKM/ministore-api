import { Trash } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

type Props = {
  onDelete: () => void;
};

export default function ConfirmDelete({ onDelete }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" size="icon" type="button">
          <Trash size={14} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Product</DialogTitle>
        </DialogHeader>
        Are you sure you want to Delete this Product?
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="submit">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              onClick={onDelete}
              variant="destructive"
              className="text-white"
              type="submit"
            >
              Delete
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
