import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Creator from "./creator";

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
          SDAaaaaaaaaa.
        </TabsContent>
        <TabsContent value="recognition" className="text-white">
          Change your password here.
        </TabsContent>
        <TabsContent value="creator" className="text-white">
          <Creator />
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default Tabss;
