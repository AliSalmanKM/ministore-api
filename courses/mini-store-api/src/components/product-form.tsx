import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoaderCircle } from "lucide-react";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Product } from "@/data";
import { toast } from "sonner";
import axios from "@/services/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { defaultProduct } from "@/pages/home";
import useAuth from "@/hooks/useAuth";
import { AxiosResponse } from "axios";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formSchema = z.object({
  name: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  price: z.number().min(1, "Required"),
  image: z
    .instanceof(File, { message: "required" })
    .refine(
      (file) =>
        file &&
        ACCEPTED_IMAGE_TYPES.includes(file.type) &&
        file.size <= MAX_FILE_SIZE,
      "Invalid file. Choose either JPEG, JPG, PNG, or WEBP image. Max file size allowed is 5MB."
    )
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  trigger: ReactNode;
  selectedProduct: Product;
  setSelectedProduct: Dispatch<SetStateAction<Product>>;
  type: "add" | "edit";
};

export default function ProductForm({
  trigger,
  selectedProduct,
  type = "add",
  setSelectedProduct,
}: Props) {
  const [open, setOpen] = useState(false);
  const { auth } = useAuth();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: selectedProduct as FormValues,
  });

  const { mutate: createProduct, isPending: isCreatingProduct } = useMutation<
    Product,
    Error,
    FormValues
  >({
    mutationFn: async (data) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price.toString());

      if (type === "add") {
        if (data.image instanceof File) {
          formData.append("image", data.image);
        } else {
          throw new Error("Image file is required for creating a new product");
        }
      } else {
        if (data.image instanceof File) {
          formData.append("image", data.image);
        } else {
          formData.append("image", selectedProduct.imageUrl);
        }
      }

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${auth.access_token}`,
        },
      };

      if (type === "add") {
        const response: AxiosResponse<Product> = await axios.post(
          "/products",
          formData,
          config
        );
        return response.data;
      } else {
        const response: AxiosResponse<Product> = await axios.put(
          `/products/${selectedProduct?._id}`,
          formData,
          config
        );
        return response.data;
      }
    },
    onSuccess: () => {
      if (type === "add") {
        toast.success("Product Created 🎉");
      } else {
        toast.success("Product Updated 🎉");
      }
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => toast.error("Something went wrong"),
    onSettled: () => {
      form.reset();
      setSelectedProduct(defaultProduct);
      setOpen(false);
    },
  });

  useEffect(() => {
    form.reset(selectedProduct as FormValues);
  }, [selectedProduct]);

  const onSubmit = (values: FormValues) => {
    createProduct(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{type === "add" ? "Add" : "Edit"} a Product</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-0 pb-2 px-1">
                  <FormLabel>Product name</FormLabel>
                  <FormControl>
                    <Input placeholder="Product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="space-y-0 pb-2 px-1">
                  <FormLabel>Product price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Product price"
                      {...field}
                      onChange={(e) => {
                        const value = parseInt(e.target.value, 10);
                        field.onChange(value > 0 ? value : "");
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-0 pb-2 px-1">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem className="space-y-0">
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Click for Image"
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file =
                          event.target.files && event.target.files[0];
                        if (file) {
                          onChange(file);
                        }
                      }}
                      {...fieldProps}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.image?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <DialogFooter className="px-3 pt-3">
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isCreatingProduct}
                className="w-fit flex items-center gap-2"
              >
                {isCreatingProduct ? (
                  <LoaderCircle className="animate-spin w-5 h-5 text-accent" />
                ) : null}
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
