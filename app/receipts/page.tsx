import PDFDropzone from "@/components/PDFDropzone";

const MyReceipts = () => {
  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <PDFDropzone />

        {/* <ReceiptList /> */}
      </div>
    </div>
  );
};

export default MyReceipts;
