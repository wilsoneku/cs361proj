import DisplayCalculations from "@/app/ui/calculators/display-calculations";
import NewCalculationButton from "@/app/ui/calculators/new-calculation-button";

export default function Page() {
    return (
        <div className="min-h-screen min-w-screen">
            <div className="flex flex-col items-center justify-center gap-12 mt-4">
                <h2 className="text-4xl font-bold leading-tight">
                    Calculators
                </h2>
                <div className="flex flex-col gap-4">
                    <NewCalculationButton />
                    <DisplayCalculations />
                </div>
            </div>
        </div>

    );
}
