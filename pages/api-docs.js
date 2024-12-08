// pages/api-docs.js
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

const ApiDocs = () => {
  const [swaggerSpec, setSwaggerSpec] = useState(null);

  useEffect(() => {
    const fetchSwaggerSpec = async () => {
      try {
        const res = await fetch("/api/swagger");
        if (!res.ok) {
          throw new Error("Failed to fetch Swagger spec");
        }
        const spec = await res.json();
        setSwaggerSpec(spec);
      } catch (error) {
        console.error("Error fetching Swagger spec:", error);
      }
    };

    fetchSwaggerSpec();
  }, []);

  if (!swaggerSpec) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>API Documentation</h1>
      <SwaggerUI spec={swaggerSpec} />
    </div>
  );
};

export default ApiDocs;
