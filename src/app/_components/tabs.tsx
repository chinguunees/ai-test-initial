import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Creator from "./creator";
import Analysis from "./imageAnalysis";
import Chat from "./ingredient";

const Tabss = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Tabs defaultValue="creator" className="w-[700px]">
        <TabsList>
          <TabsTrigger value="analysis">Image Analysis</TabsTrigger>
          <TabsTrigger value="recognition">Ingredients Recognition</TabsTrigger>
          <TabsTrigger value="creator">Image Creator</TabsTrigger>
        </TabsList>
        <TabsContent value="analysis" className="text-white">
          <Analysis />
        </TabsContent>
        <TabsContent value="recognition" className="text-white">
          <Chat />
        </TabsContent>
        <TabsContent value="creator" className="text-white">
          <Creator />
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default Tabss;
