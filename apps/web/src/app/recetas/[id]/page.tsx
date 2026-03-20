import RecipeContent from "@/components/RecipeContent";

/* Server component shell — delegates to RecipeContent client component */
export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="pb-20">
      <RecipeContent id={id} />
    </div>
  );
}
