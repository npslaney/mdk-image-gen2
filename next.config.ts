import type { NextConfigOverrides } from "@moneydevkit/nextjs/next-plugin";
import withMdkCheckout from "@moneydevkit/nextjs/next-plugin";

const nextConfig: NextConfigOverrides = {
  /* config options here */
  reactCompiler: true,
};

export default withMdkCheckout(nextConfig);
