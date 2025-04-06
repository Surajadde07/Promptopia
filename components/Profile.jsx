import PromptCard from "./PromptCard";

const Profile = ({ name, desc, data, handleEdit, handleDelete }) => {
    return (
        <section className="w-full">
            <h1 className="head_text text-left">
                <span className="blue_gradient">{name} Profile</span>
            </h1>
            <p className="desc text-left">{desc}</p>

            {data.length > 0 ? (
                <div className="mt-10 prompt_layout">
                    {data.map((post) => (
                        <PromptCard
                            key={post._id}
                            post={post}
                            handleEdit={() => handleEdit && handleEdit(post)}
                            handleDelete={() => handleDelete && handleDelete(post)}
                        />
                    ))}
                </div>
            ) : (
                <div className="mt-10 flex justify-center items-center h-40 border border-gray-200 rounded-lg">
                    <p className="font-inter text-gray-500 text-center">
                        No prompts found. Start creating your first prompt to inspire others!
                    </p>
                </div>
            )}
        </section>
    );
};

export default Profile;