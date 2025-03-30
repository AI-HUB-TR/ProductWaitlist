import { useState } from "react";
import { aiModels, getAllCategories } from "@/data/aiModels";
import ModelCard from "@/components/cards/ModelCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ModelGrid() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const categories = getAllCategories();

  // Filtreleme işlemi
  const filteredModels = selectedCategory === "all" 
    ? aiModels 
    : aiModels.filter(model => model.category === selectedCategory);

  return (
    <section className="py-6 px-4 max-w-7xl mx-auto model-grid-section">
      <div className="mb-4 text-center">
        <p className="text-base text-muted-foreground max-w-3xl mx-auto">
          İstediğiniz yapay zeka modelini seçin ve hemen kullanmaya başlayın.
        </p>
      </div>

      <Tabs 
        defaultValue="all" 
        className="mb-8" 
        onValueChange={setSelectedCategory}
      >
        <div className="flex justify-center mb-8 overflow-x-auto">
          <TabsList className="bg-muted/60">
            <TabsTrigger value="all">Tümü</TabsTrigger>
            {categories.map(category => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value={selectedCategory} className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModels.map(model => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}