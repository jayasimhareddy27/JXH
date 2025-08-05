import {Gemini} from '../(components)/gemini';
import {HuggingFace} from '../(components)/huggingface';
import {Ollama} from '../(components)/ollama';

const Settings = () => {
  return (
    <main>
      <div className="card space-y-5">
        <div className="text-center">
          <h1  className="text-3xl font-bold">  AI Agent Settings</h1>
          <p  className="mt-2 text-[color:var(--color-paragraph)]">  Configure and manage your AI model settings for each provider.</p>
        </div>

        <div className=" grid md:grid-cols-3 gap-8 ">
          <section className="h-fit p-6 rounded-xl shadow-md border bg-[color:var(--color-card-bg)] " >
            <Gemini />
          </section>

          <section
            className="p-6 rounded-xl shadow-md border bg-[color:var(--color-card-bg)]">
            <HuggingFace />
          </section>

          <section
            className="p-6 rounded-xl shadow-md border bg-[color:var(--color-card-bg)]">
            <Ollama />
          </section>
        </div>
      </div>
    </main>
  );
};

export default Settings;
