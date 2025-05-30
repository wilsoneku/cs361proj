import Calculators from "@/app/ui/calculators/calculators";
import NewCalculation from "@/app/ui/calculators/new-calculation";

export default function Page() {
    return (
        <div className="flex flex-col items-center justify-center gap-12 mt-4">
            <h2 className="text-4xl font-bold leading-tight">
                Calculators
            </h2>
            <div>
                <NewCalculation />
                <Calculators />

            </div>
        </div>
    );
}
