

export default function UserProfile({ params }: any) {
  return (
    <div className="flex h-screen text-white items-center justify-center bg-black">
      <div className="w-full max-w-sm p-6 text-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Profile {params.id}</h2>
      </div>
    </div>
  );
}
