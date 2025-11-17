import type { NextConfig } from "next";
import withMdkCheckout from "@moneydevkit/nextjs/next-plugin";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
};

export default withMdkCheckout();
