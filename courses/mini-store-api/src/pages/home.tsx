import Header from "@/components/header";
import { CirclePlus, Edit, Search } from "lucide-react";
import { Input } from "../components/ui/input";
import { useEffect, useState } from "react";
import { Card } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Product } from "@/data";
import ProductForm from "@/components/product-form";
import ConfirmDelete from "@/components/confirm-delete";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/services/axios";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";

export const defaultProduct: Product = {
  name: "",
  description: "",
  image: null,
  imageUrl: "",
  price: 0,
  _id: "",
};

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(defaultProduct);
  const { auth } = useAuth();

  const queryClient = useQueryClient();

  // Delete Product
  const { mutate: deleteProduct } = useMutation({
    mutationFn: (id: string) =>
      axios.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${auth.access_token}` },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully");
    },
    onError: () => toast.error("Something went wrong"),
  });

  const { data: products, isPending } = useQuery({
    queryKey: ["products"],
    queryFn: () => axios.get("/products"),
    select: (data) =>
      data.data?.filter((item: Product) =>
        item?.name.toLowerCase().includes(debouncedSearchTerm)
      ),
  });

  useEffect(() => {
    const debounceId = setTimeout(
      () => setDebouncedSearchTerm(searchTerm),
      1000
    );

    return () => clearTimeout(debounceId);
  }, [searchTerm]);

  return (
    <>
      <Header />
      <main className="p-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between gap-4 w-full">
          <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <form>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search"
                  className="pl-8"
                />
              </div>
            </form>
          </div>
          <ProductForm
            type="add"
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            trigger={
              <Button
                onClick={() => setSelectedProduct(defaultProduct)}
                className="flex items-center gap-2"
              >
                <CirclePlus size={14} /> Create Product
              </Button>
            }
          />
        </div>
        {/* Products List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-4 pt-0">
          {isPending ? (
            Array.from(Array(2).keys()).map((item) => (
              <Card key={item}>
                <div className="flex flex-col gap-6 p-6">
                  <Skeleton className="h-48" />
                  <div className="flex items-center justify-between space-x-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-60" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="w-16 h-6 rounded-lg" />
                  </div>
                  <div className="flex flex-col space-y-3">
                    <div className="space-y-2">
                      <Skeleton className="h-4" />
                      <Skeleton className="h-4" />
                      <Skeleton className="h-4" />
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : products?.length > 0 ? (
            products?.map((item: Product) => (
              <Card
                key={item._id}
                className="flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-primary/10"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full rounded-md"
                />
                <div className="flex justify-between w-full">
                  <div className="flex w-full flex-col gap-1">
                    <p className="font-semibold text-xl">{item.name}</p>
                    <span className="text-sm text-slate-600">
                      {item.description.substring(0, 300)}
                    </span>
                  </div>

                  <div className="text-2xl font-semibold">{item.price}$</div>
                </div>
                <div className="flex items-center gap-2">
                  <ProductForm
                    type="edit"
                    selectedProduct={selectedProduct}
                    setSelectedProduct={setSelectedProduct}
                    trigger={
                      <Button
                        variant="outline"
                        size="icon"
                        className="flex items-center gap-2"
                        type="button"
                        onClick={() => setSelectedProduct(item)}
                      >
                        <Edit size={14} />
                      </Button>
                    }
                  />
                  <ConfirmDelete onDelete={() => deleteProduct(item._id!)} />
                </div>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center col-span-1 md:col-span-2 lg:col-span-3 text-center gap-4 py-16">
              <h3 className="text-3xl lg:text-4xl font-semibold">
                No Products Found
              </h3>
              <p className="text-black/70">Add your first Product</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
