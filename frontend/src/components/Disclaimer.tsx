import { AlertTriangle } from "lucide-react";

/**
 * A stylish top disclaimer bar for prototype/demo versions of your product.
 * Modify colors or icons to fit your brand theme.
 */
export function DisclaimerBar() {
  return (
    <div className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white px-4 py-2 text-center flex items-center justify-center gap-2 font-medium shadow-md z-50 sticky top-0">
      <AlertTriangle className="w-5 h-5 animate-pulse text-red-700" />
      <span className="text-sm md:text-base">
        This is a <span className="font-semibold">prototype</span>. The final
        product will offer a feature-packed and significantly enhanced
        experience.
      </span>
    </div>
  );
}
