import PublicLayout from "@/components/layouts/PublicLayout";

interface WhyProps {}

const Why = ({}: WhyProps) => {
  return (
    <PublicLayout>
      <div className="flex items-center justify-center flex-col h-screen">
        <h1 className="text-3xl font-black">Ngapain Harus di Bantuin</h1>
      </div>
    </PublicLayout>
  );
};

export default Why;
