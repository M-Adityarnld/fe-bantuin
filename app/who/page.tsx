import PublicLayout from "@/components/layouts/PublicLayout";

interface PageProps {}

const Who = ({}: PageProps) => {
  return (
    <PublicLayout>
      <div className="flex items-center justify-center flex-col h-screen">
        <h1 className="text-3xl font-black">Tentang Kami</h1>
      </div>
    </PublicLayout>
  );
};

export default Who;
