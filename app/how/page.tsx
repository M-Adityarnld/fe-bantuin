import PublicLayout from "@/components/layouts/PublicLayout";

interface HowProps {}

const How = ({}: HowProps) => {
  return (
    <PublicLayout>
      <div className="flex items-center justify-center flex-col h-screen">
        <h1 className="text-3xl font-black">Gimana Cara Kerjanya?</h1>
      </div>
    </PublicLayout>
  );
};

export default How;
