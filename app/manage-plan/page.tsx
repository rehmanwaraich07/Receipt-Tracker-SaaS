import SchematicComponent from "@/components/schematic/SchematicComponent";

const ManagePlan = () => {
  return (
    <div className="container xl:max-w-5xl mx-auto p-4 md:p-0">
      <h1 className="text-2xl font-bold mb-4 my-8">Mange your Plan</h1>
      <p className="text-gray-600 mb-8">
        Manage your subscriptions and biliing details here.
      </p>

      <SchematicComponent
        componentId={
          process.env.NEXT_PUBLIC_SCHEMATIC_CUSTOMER_PORTAL_COMPONENT_ID!
        }
      />
    </div>
  );
};

export default ManagePlan;
