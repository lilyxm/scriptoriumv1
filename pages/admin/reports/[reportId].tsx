import React from "react";
import { useRouter } from "next/router";
import SingleReport from "@/components/SingleReport";
import Header from "@/components/header";
const ReportPage: React.FC = () => {
  const router = useRouter();
  const { reportId } = router.query;

  if (!reportId) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Header isAuthenticated={true} />
      <SingleReport reportId={parseInt(reportId as string, 10)} />
    </>
  );
};

export default ReportPage;
