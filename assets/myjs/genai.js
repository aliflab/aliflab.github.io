(function () {
  var TIERS = {
    1: { color: '#7c3aed', rgba: 'rgba(124,58,237,0.07)',  label: 'Tier 1 · Primary', desc: 'Daily driver, deeply integrated'   },
    2: { color: '#1089ff', rgba: 'rgba(16,137,255,0.08)',  label: 'Tier 2',            desc: 'Regular use, high proficiency'     },
    3: { color: '#0ea5e9', rgba: 'rgba(14,165,233,0.08)',  label: 'Tier 3',            desc: 'Frequent use, task-specific'       },
    4: { color: '#10b981', rgba: 'rgba(16,185,129,0.08)',  label: 'Tier 4',            desc: 'Moderate use, growing familiarity' },
    5: { color: '#f59e0b', rgba: 'rgba(245,158,11,0.08)',  label: 'Tier 5',            desc: 'Experimental, occasional use'      },
    6: { color: '#6b7280', rgba: 'rgba(107,114,128,0.07)', label: 'Tier 6',            desc: 'Explored, aware of capabilities'   }
  };

  var TOOLS = [
    // ── Tier 1 ──────────────────────────────────────────────────────────────────
    {
      name: 'Claude Code', tier: 1, cat: 'coding',
      logo: 'https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/dark/claudecode-color.png',
      summary: 'Agentic AI coding tool operating directly in terminal and IDE.',
      desc: 'Claude Code is Anthropic\'s agentic coding CLI that operates directly in the terminal and IDE, capable of reading codebases, writing and editing files, running commands, and completing multi-step development tasks autonomously. It provides a conversational interface to the entire development environment.',
      usage: 'Used for agentic coding tasks directly in the terminal — including this website\'s development, implementing complex multi-file feature requests, automated refactoring workflows, and exploring codebases through natural language queries.',
      cases: ['Multi-file codebase editing and refactoring from natural language instructions', 'Terminal-based agentic development and feature implementation', 'Automated implementation of complex multi-step coding tasks', 'Codebase exploration, architecture analysis, and technical documentation']
    },
    {
      name: 'Claude', tier: 1, cat: 'llm',
      logo: 'https://img.icons8.com/?size=100&id=zQjzFjPpT2Ek&format=png&color=000000',
      summary: 'Daily driver for AI workflows, API dev, and enterprise automation.',
      desc: 'Claude is Anthropic\'s flagship AI assistant renowned for nuanced long-context reasoning, safety-first design, and strong tool-use capabilities. It excels at complex analysis, code generation, agentic task execution, and high-quality long-form writing. Claude\'s extended context window and MCP support make it the foundation for advanced AI pipelines.',
      usage: 'My primary AI for everything — building MCP-based agents, writing enterprise IT documentation, developing Claude API applications, and designing prompt engineering frameworks. I use it daily for code review, SharePoint governance planning, and generating structured content for M365 Copilot readiness projects.',
      cases: ['Building agentic pipelines with Claude API and MCP servers', 'Drafting enterprise SOPs, runbooks, and IT knowledge base articles', 'Code review, multi-file refactoring, and architectural guidance', 'Designing and stress-testing prompt engineering frameworks']
    },

    // ── Tier 2 ──────────────────────────────────────────────────────────────────
    {
      name: 'ChatGPT', tier: 2, cat: 'llm',
      logo: 'https://img.icons8.com/color/48/chatgpt.png',
      summary: 'Go-to for brainstorming, research synthesis, and broad general tasks.',
      desc: 'ChatGPT by OpenAI is one of the most widely deployed AI assistants globally, offering strong general-purpose reasoning, real-time web browsing, image generation via DALL·E, and multimodal voice interaction through GPT-4o. Its broad plugin ecosystem and familiarity make it a versatile second opinion tool.',
      usage: 'Used for rapid brainstorming, cross-validating outputs against Claude, and tasks requiring web browsing. I leverage it for content ideation, LinkedIn post drafts, and exploring ideas before committing to longer Claude sessions for deep work.',
      cases: ['Cross-validating AI outputs for critical decisions and documentation', 'Research synthesis with real-time web browsing capability', 'Content ideation for LinkedIn and professional social platforms', 'Multimodal tasks combining text and image analysis']
    },
    {
      name: 'Gemini', tier: 2, cat: 'llm',
      logo: 'https://img.icons8.com/?size=100&id=eoxMN35Z6JKg&format=png&color=000000',
      summary: 'Deep Google Workspace integration and real-time grounded reasoning.',
      desc: 'Gemini is Google\'s flagship multimodal AI model with native integration across Google Workspace, Search, and Android. Gemini 2.0 Flash and Pro offer advanced reasoning, code execution, and real-time information grounding via Google Search, making it highly capable for tasks requiring current data.',
      usage: 'Used when working within Google Workspace or needing current-event grounding. I compare Gemini\'s reasoning against other frontier models for research validation and use it for tasks involving Google Docs, Sheets, or Gmail drafting within shared project contexts.',
      cases: ['Google Workspace tasks — Docs, Sheets, and Gmail drafting assistance', 'Real-time information retrieval grounded in current search data', 'Cross-model reasoning comparison for research validation', 'Multimodal document and image analysis']
    },
    {
      name: 'M365 Copilot', tier: 2, cat: 'agents',
      logo: 'https://img.icons8.com/?size=100&id=PxQoyT1s0uFh&format=png&color=000000',
      summary: 'Enterprise AI across Teams, Outlook, Word, and SharePoint.',
      desc: 'Microsoft 365 Copilot embeds AI capabilities directly into the M365 suite — Teams, Outlook, Word, Excel, PowerPoint, and SharePoint — using the Microsoft Graph to deliver context-aware assistance grounded in organisational data. It represents the enterprise AI layer for organisations running on Microsoft infrastructure.',
      usage: 'Deployed and administered M365 Copilot across the enterprise at H.Parsons. I design SharePoint environments for Copilot data readiness, manage information governance for AI access policies, and use Copilot daily for meeting summaries, email drafting, and document generation within Teams and Outlook.',
      cases: ['Deploying and governing M365 Copilot across enterprise Microsoft 365 tenants', 'SharePoint architecture design for Copilot data readiness and permissions', 'Meeting summary extraction and action item generation in Teams', 'Automated document and proposal generation in Word and PowerPoint']
    },

    // ── Tier 3 ──────────────────────────────────────────────────────────────────
    {
      name: 'Meta AI', tier: 3, cat: 'llm',
      logo: 'https://img.icons8.com/?size=100&id=PvvcWRWxRKSR&format=png&color=000000',
      summary: 'Integrated into WhatsApp and Instagram for quick AI interactions.',
      desc: 'Meta AI is powered by the Llama family of open-weight models and is embedded natively into Meta\'s social platforms including WhatsApp, Instagram, and Facebook. It provides seamless conversational AI access within everyday communication channels without requiring a separate application.',
      usage: 'Used within WhatsApp for quick information lookups, calculations, and conversational queries during mobile-first workflows. Useful for reaching AI assistance without context switching while coordinating with teams on messaging platforms.',
      cases: ['Quick information lookups and Q&A within WhatsApp conversations', 'Image generation and description within Instagram workflows', 'Conversational AI during mobile-first and on-the-go tasks', 'Evaluating open-weight Llama model capabilities for self-hosted consideration']
    },
    {
      name: 'Perplexity', tier: 3, cat: 'llm',
      logo: 'https://img.icons8.com/?size=100&id=kzJWN5jCDzpq&format=png&color=000000',
      summary: 'AI-powered search engine for fast, cited research answers.',
      desc: 'Perplexity is an AI answer engine that combines LLM reasoning with real-time web search to deliver cited, up-to-date responses. It is built specifically for research and information retrieval, with source attribution ensuring verifiability of every claim in its answers.',
      usage: 'My preferred tool for quick research requiring current data with citations — useful for staying updated on AI model releases, verifying facts before publishing documentation, and researching vendor products for enterprise IT procurement decisions.',
      cases: ['Research with citations for IT procurement and vendor comparisons', 'Staying current on AI model releases and technology news', 'Fact-checking content before publishing technical documentation', 'Quick technical reference and specification lookups']
    },
    
    {
      name: 'DeepSeek', tier: 3, cat: 'llm',
      logo: 'https://img.icons8.com/color/48/deepseek.png',
      summary: 'Strong open-weight reasoning model for cost-effective technical tasks.',
      desc: 'DeepSeek is a Chinese AI research lab producing high-performance open-weight models. DeepSeek-R1 achieves frontier-level reasoning on coding and mathematics at significantly lower inference cost, making it a compelling option for cost-sensitive AI workloads and self-hosted deployments.',
      usage: 'Used for cost-effective reasoning and technical problem solving where proprietary model costs are a concern. I evaluate DeepSeek for potential self-hosted LLM scenarios in enterprise contexts requiring data residency and on-premise processing.',
      cases: ['Cost-effective reasoning for technical and coding tasks at scale', 'Benchmarking open-weight model performance against proprietary models', 'Exploring self-hosted LLM deployment for enterprise data residency requirements', 'Mathematical reasoning and algorithmic problem solving']
    },

    // ── Tier 4 ──────────────────────────────────────────────────────────────────
    {
      name: 'Grok', tier: 4, cat: 'llm',
      logo: 'https://img.icons8.com/color/48/grok.png',
      summary: 'Real-time X/Twitter data and unfiltered reasoning for analysis.',
      desc: 'Grok is xAI\'s large language model integrated with the X platform, providing real-time access to trending topics, social media data, and public discourse. Grok 3 delivers competitive reasoning performance with a less restricted conversational style suited for exploratory thinking.',
      usage: 'Used for tasks requiring real-time social data and trend monitoring. I use it to explore unconventional solution angles, monitor technology discourse on X, and compare reasoning performance against other frontier models for evaluation purposes.',
      cases: ['Real-time trend monitoring and social data analysis on X', 'Exploring unfiltered perspectives on complex technical problems', 'Benchmarking reasoning against other frontier LLMs', 'Researching public discourse and reactions to technology announcements']
    },
    {
      name: 'Cursor', tier: 4, cat: 'coding',
      logo: 'https://img.icons8.com/color/48/cursor-ai.png',
      summary: 'AI-native code editor for full codebase context and multi-file edits.',
      desc: 'Cursor is an AI-native code editor forked from VS Code, featuring deep AI integration for code completion, multi-file editing, and codebase-wide context understanding. It supports Claude, GPT-4o, and other models as the underlying AI, enabling context-aware code generation across entire projects.',
      usage: 'Used for AI-assisted development of Python automation scripts, web applications, and IT tooling. I leverage Cursor\'s codebase-wide context for refactoring large projects and implementing multi-file changes that require understanding cross-file dependencies.',
      cases: ['Multi-file code generation and refactoring with full codebase context', 'Building Python automation scripts for IT and infrastructure workflows', 'Debugging complex codebases with AI-assisted root cause analysis', 'Rapid prototyping of web applications and internal tools']
    },
    {
      name: 'GitHub Copilot', tier: 4, cat: 'coding',
      logo: 'https://img.icons8.com/?size=100&id=Yl9ip6CjqAEI&format=png&color=000000',
      summary: 'IDE inline code completion and pair programming in VS Code.',
      desc: 'GitHub Copilot is an AI pair programmer by GitHub and OpenAI that provides intelligent inline code completion, function generation, and code explanation within VS Code and other IDEs. It draws on models trained across public code repositories to suggest contextually relevant completions.',
      usage: 'Used within VS Code for day-to-day development assistance, inline code completion, and boilerplate generation for IT automation scripts, API integrations, and web projects. Useful for accelerating repetitive coding patterns.',
      cases: ['Inline code completion in VS Code for Python, JavaScript, and PHP', 'Generating boilerplate for REST API integrations and SDK usage', 'Code explanation and inline documentation generation', 'Unit test scaffolding for automation scripts']
    },
    {
      name: 'Replit', tier: 4, cat: 'coding',
      logo: 'https://img.icons8.com/?size=100&id=FnhiFHcPQyOa&format=png&color=000000',
      summary: 'AI-powered browser IDE for rapid prototyping with instant hosting.',
      desc: 'Replit is a collaborative browser-based IDE with integrated AI features for code generation, debugging, and instant deployment. Replit Agent can build full applications from natural language prompts with built-in live hosting, enabling zero-friction web app creation.',
      usage: 'Used for quick prototyping and deploying small web tools and demos without local environment setup. Useful for sharing live interactive demonstrations with stakeholders and rapidly experimenting with new APIs or frameworks.',
      cases: ['Zero-setup web app prototyping and deployment in the browser', 'Sharing live interactive demos with stakeholders and collaborators', 'Experimenting with new APIs and third-party integrations quickly', 'Building and hosting simple internal tools for team use']
    },
    {
      name: 'Lovable', tier: 4, cat: 'coding',
      logo: 'https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/dark/lovable-color.png',
      summary: 'Natural language to full-stack React app generation.',
      desc: 'Lovable is an AI-powered full-stack web application builder that generates complete React applications from natural language descriptions, handling frontend components, backend logic, database schemas, and deployment automatically. It is designed to accelerate from idea to working application.',
      usage: 'Used for rapidly scaffolding full-stack web application MVPs from high-level product descriptions. I use it to accelerate the initial design and scaffolding phase, then take the generated code into Cursor or Claude Code for refinement.',
      cases: ['MVP prototyping from product requirement descriptions in minutes', 'Generating React component structures and page layouts', 'Rapid front-end prototyping for client and stakeholder presentations', 'Exploring application architecture ideas before committing to a stack']
    },
    {
      name: 'v0 by Vercel', tier: 4, cat: 'coding',
      logo: 'https://img.icons8.com/?size=100&id=eXVvv0ElyhQy&format=png&color=000000',
      summary: 'AI UI component generation for React and Next.js projects.',
      desc: 'v0 is Vercel\'s AI-powered UI generation tool that creates React and Next.js components from text or image prompts using shadcn/ui and Tailwind CSS. It specialises in generating clean, production-ready frontend components that can be directly copied into projects.',
      usage: 'Used for generating UI components and page layouts for web projects when I need clean, well-structured React components with Tailwind styling. I use v0 to rapidly prototype dashboard interfaces and component libraries for projects.',
      cases: ['Generating React UI components and layouts from design descriptions', 'Prototyping dashboard and admin interface designs', 'Creating Tailwind-styled reusable component libraries', 'Bootstrapping Next.js project UI from textual specifications']
    },
    {
      name: 'Base44', tier: 4, cat: 'coding',
      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHmRzITratk0swiKQ8PhDgN1Go7lDDrkXlVg&s',
      summary: 'AI-first app builder with integrated backend, auth, and database.',
      desc: 'Base44 is an AI-powered application builder that generates complete web applications including backend logic, database schemas, authentication, and frontend interfaces from natural language descriptions. It removes the need for separate infrastructure configuration for full-stack application development.',
      usage: 'Explored for building internal tools and web applications with integrated backend and authentication without manual infrastructure setup. Evaluating its potential for rapid internal tooling deployment within enterprise IT contexts.',
      cases: ['Building internal tools with built-in authentication and database', 'Generating full-stack applications from product specifications', 'Rapid web application prototyping with complete backend logic', 'Evaluating AI-code hybrid development for enterprise tooling needs']
    },

    // ── Tier 5 ──────────────────────────────────────────────────────────────────
    {
      name: 'NotebookLM', tier: 5, cat: 'writing',
      logo: 'https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/light/notebooklm.png',
      summary: 'AI research assistant grounded exclusively in your documents.',
      desc: 'NotebookLM is Google\'s AI-powered research assistant that grounds all responses exclusively in user-uploaded source documents, enabling accurate Q&A, summarisation, and audio overviews without hallucination from external knowledge. It supports PDFs, documents, and web content as sources.',
      usage: 'Explored for document-grounded research and summarisation, particularly for ingesting large technical specifications, vendor documentation, and research papers for targeted Q&A without wading through entire documents manually.',
      cases: ['Document-grounded Q&A on technical papers and vendor specifications', 'Summarising large PDF research materials and manuals', 'Generating audio podcast-style overviews of complex documents', 'Building research notes from multiple source documents simultaneously']
    },
    {
      name: 'Notion AI', tier: 5, cat: 'writing',
      logo: 'https://img.icons8.com/?size=100&id=wue74HqaylSJ&format=png&color=000000',
      summary: 'Inline AI writing and summarisation within Notion workspaces.',
      desc: 'Notion AI is the integrated AI assistant within Notion that provides inline writing assistance, document summarisation, translation, and workspace-aware Q&A. It understands the context of the entire workspace to deliver relevant, grounded assistance for knowledge management tasks.',
      usage: 'Used within Notion for summarising meeting notes, generating structured content from rough ideas, and automating repetitive documentation tasks within personal and project knowledge bases.',
      cases: ['Summarising meeting notes and converting them to structured pages', 'Generating structured documentation from rough bullet-point notes', 'Translating and reformatting content within Notion databases', 'Automating repetitive documentation tasks across workspace pages']
    },
    {
      name: 'ElevenLabs', tier: 5, cat: 'video',
      logo: 'https://img.icons8.com/?size=100&id=K74MLFSfSJzy&format=png&color=000000',
      summary: 'Realistic AI voice cloning and text-to-speech synthesis.',
      desc: 'ElevenLabs is a leading AI voice synthesis platform offering highly realistic text-to-speech, voice cloning, automatic dubbing, and audio generation capabilities. It supports multiple languages and custom voice creation for professional-quality voiceovers and audio content production.',
      usage: 'Explored for generating voiceovers for explainer and demo videos, creating custom AI voices for branded content, and evaluating AI dubbing capabilities for potential multilingual content delivery.',
      cases: ['Voiceover generation for explainer, demo, and training videos', 'Custom AI voice creation for branded and professional content', 'AI dubbing for multilingual video distribution', 'Text-to-speech for accessibility features and audio content production']
    },
    {
      name: 'Canva AI', tier: 5, cat: 'video',
      logo: 'https://img.icons8.com/color/48/canva.png',
      summary: 'AI design tools for quick social and marketing visuals in Canva.',
      desc: 'Canva AI integrates multiple generative AI features into the Canva platform including Magic Design, text-to-image generation, background removal, Magic Write for copy, and AI video generation. It makes professional visual content creation accessible without traditional design software expertise.',
      usage: 'Used for quick graphic design, social media visuals, and presentation content leveraging AI-assisted templates and generation tools within Canva\'s accessible, no-design-skills-required interface.',
      cases: ['Social media graphic and banner creation with AI design assistance', 'Quick presentation slide design from templates and AI suggestions', 'AI image generation for marketing visuals and content', 'Marketing material design without professional design tools']
    },
    {
      name: 'Midjourney', tier: 5, cat: 'video',
      logo: 'https://img.icons8.com/color/48/midjourney.png',
      summary: 'Industry-leading AI image generation for artistic and photorealistic visuals.',
      desc: 'Midjourney is a leading AI image generation service known for producing exceptionally high-quality, artistic, and photorealistic images from text prompts. Accessed via Discord and a dedicated web interface, it consistently produces aesthetically superior results for creative and professional visual content.',
      usage: 'Explored for generating high-quality visual assets, concept art, and distinctive imagery for project presentations and portfolio work requiring AI-generated visuals with premium aesthetic quality.',
      cases: ['High-quality concept art and visual asset generation for projects', 'Presentation and portfolio imagery with distinctive aesthetic quality', 'Exploring photorealistic AI image generation for content pipelines', 'Creative direction exploration and visual mood board generation']
    },
    {
      name: 'Zapier', tier: 5, cat: 'automation',
      logo: 'https://img.icons8.com/color/48/zapier.png',
      summary: 'No-code workflow automation connecting thousands of SaaS apps.',
      desc: 'Zapier is a no-code automation platform connecting thousands of web applications through automated workflows called Zaps. Its AI features enable natural language workflow creation and AI-powered data transformation steps within multi-app automation pipelines.',
      usage: 'Explored for connecting web applications and automating cross-platform data flows without code, evaluating its applicability to enterprise SaaS integration use cases in project management and communication tools.',
      cases: ['Automating data flows and triggers between SaaS applications', 'Cross-platform workflow automation without writing code', 'AI-powered data transformation and routing in multi-app pipelines', 'Evaluating no-code automation suitability for enterprise integration scenarios']
    },
    {
      name: 'n8n', tier: 5, cat: 'automation',
      logo: 'https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/dark/n8n-color.png',
      summary: 'Open-source self-hostable automation with AI agent node support.',
      desc: 'n8n is a self-hostable open-source workflow automation platform with a visual node editor supporting complex multi-step workflows, LLM integration nodes, and deep customisation. Its open-source model enables full data control and custom integrations critical for enterprise data residency requirements.',
      usage: 'Explored for building self-hosted AI automation workflows with full data sovereignty, particularly for enterprise contexts requiring on-premise data processing and integration with internal systems.',
      cases: ['Self-hosted AI workflow automation with full data control and residency', 'Complex multi-step automation with custom business logic', 'Building AI agent workflows integrating LLMs with internal systems', 'Enterprise automation requiring on-premise or private cloud deployment']
    },

    // ── Tier 6 ──────────────────────────────────────────────────────────────────
    {
      name: 'HeyGen', tier: 6, cat: 'video',
      logo: 'https://img.icons8.com/?size=100&id=nYpTA1hyYtTK&format=png&color=000000',
      summary: 'AI avatar video generation for professional presentations.',
      desc: 'HeyGen is an AI video generation platform that creates realistic AI avatar videos from text scripts, supporting custom avatar creation, voice cloning, and multilingual video production. It removes the need for traditional recording setups for producing professional-looking presentation and explainer content.',
      usage: 'Used experimentally for creating AI avatar-driven explainer videos and demo content for projects and personal branding. Evaluated for potential use in producing IT training and onboarding content at scale without traditional video production overhead.',
      cases: ['Creating AI avatar explainer videos for project demonstrations', 'Generating multilingual training content without re-recording', 'Personal branding video content production', 'Evaluating AI video for enterprise training content delivery']
    },
    {
      name: 'Synthesia', tier: 6, cat: 'video',
      logo: 'https://img.icons8.com/?size=100&id=7TjmdSOn0P4R&format=png&color=000000',
      summary: 'Enterprise-grade AI avatar videos from text scripts.',
      desc: 'Synthesia is an enterprise AI video generation platform specialising in professional training and corporate communication videos using AI presenters across 140+ languages. It provides a polished, enterprise-grade alternative to HeyGen, widely adopted for L&D and internal communications.',
      usage: 'Explored for creating training and onboarding video content for enterprise IT workflows, particularly for SOP walkthrough videos and knowledge base content that would otherwise require recorded screencasts or studio production.',
      cases: ['IT training and onboarding video production at scale', 'SOP and procedure walkthrough video documentation', 'Corporate communication content for distributed teams', 'Multilingual IT training delivery across international teams']
    },
    {
      name: 'Descript', tier: 6, cat: 'video',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Descript_%28Icon%29.svg/1920px-Descript_%28Icon%29.svg.png',
      summary: 'AI video and podcast editing through text transcript manipulation.',
      desc: 'Descript is an AI-powered media editing platform that enables video and audio editing through text transcript manipulation rather than traditional timeline editing. Features include Overdub voice cloning, automatic filler word removal, and AI-assisted clip generation for content repurposing.',
      usage: 'Used for editing recorded video and audio content by manipulating the transcript — removing filler words, cutting sections, and generating short clips for social media distribution without traditional video editing expertise.',
      cases: ['Transcript-based video editing for recorded presentations and demos', 'Automated filler word and silence removal from recordings', 'Creating short social clips from long-form recorded content', 'Podcast and audio content editing and cleanup']
    },
    {
      name: 'Opus Clip', tier: 6, cat: 'video',
      logo: 'https://avatars.githubusercontent.com/u/94627721?s=200&v=4',
      summary: 'AI tool for clipping long videos into viral short-form content.',
      desc: 'Opus Clip is an AI-powered video repurposing tool that automatically identifies the most engaging moments in long-form videos and transforms them into short-form clips optimised for TikTok, Instagram Reels, and YouTube Shorts with captions and framing applied automatically.',
      usage: 'Used for repurposing long-form recorded content into short clips for social media distribution, maximising content reach from existing recordings with minimal manual editing effort and no additional production time.',
      cases: ['Repurposing long videos into YouTube Shorts and Instagram Reels', 'Identifying key moments and highlights in recorded presentations', 'Building a social media content pipeline from existing video assets', 'Automating short-form content creation from webinars and talks']
    },
    {
      name: 'Jasper', tier: 6, cat: 'writing',
      logo: 'https://vectorseek.com/wp-content/uploads/2024/01/Jasper-Logo-Vector.svg-.png',
      summary: 'Enterprise AI writing platform for brand-consistent content.',
      desc: 'Jasper is an enterprise AI writing platform designed for marketing and content teams, offering brand voice customisation, content templates, and AI writing assistance for long-form blog posts, social media content, and ad copy at scale. It includes workflow tools for collaborative content production.',
      usage: 'Explored for generating marketing-style content with enforced brand voice consistency, particularly for project documentation, portfolio content, and professional write-ups requiring a specific tone.',
      cases: ['Brand-consistent marketing and content generation at scale', 'Long-form blog post and article drafting and SEO optimisation', 'Social media content creation across multiple channels', 'Ad copy and email marketing sequence drafts']
    },
    {
      name: 'Copy.ai', tier: 6, cat: 'writing',
      logo: 'https://img.icons8.com/?size=100&id=tv7GSC4vCGHe&format=png&color=000000',
      summary: 'AI copywriting for emails, social posts, and marketing content.',
      desc: 'Copy.ai is an AI-powered copywriting tool generating marketing copy, email sequences, social media posts, and product descriptions. It includes workflow automation for content production pipelines and team collaboration tools for scaling content output.',
      usage: 'Used occasionally for generating email copy, social media captions, and marketing material drafts when speed of content production is the priority over deep customisation.',
      cases: ['Email sequence drafting and subject line optimisation', 'Social media caption and post generation across platforms', 'Product and feature description writing for documentation', 'Cold outreach and professional message drafting at volume']
    },
    {
      name: 'Manus AI', tier: 6, cat: 'agents',
      logo: 'https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/light/manus.png',
      summary: 'Fully autonomous AI agent for multi-step research and execution.',
      desc: 'Manus is a fully autonomous AI agent capable of executing complex multi-step tasks including web research, data analysis, code execution, and file manipulation with minimal human intervention. It operates across browser, terminal, and file system environments to complete long-horizon tasks end-to-end.',
      usage: 'Explored for automating multi-step research tasks, competitive analysis, and complex workflows requiring browsing, processing, and synthesising information from multiple sources into structured output without manual orchestration.',
      cases: ['Autonomous multi-step research and structured report generation', 'Automated data gathering and analysis from multiple web sources', 'Complex task execution spanning browser and file system environments', 'Evaluating autonomous agent capabilities and failure modes for production use']
    }
  ];

  // ── Build pyramid ──────────────────────────────────────────────────────────
  var wrap = document.getElementById('genaiPyramidWrap');
  if (!wrap) return;

  // Group tools by tier, preserving order
  var byTier = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
  TOOLS.forEach(function (tool) { byTier[tool.tier].push(tool); });

  [1, 2, 3, 4, 5, 6].forEach(function (t) {
    var tc   = TIERS[t];
    var row  = document.createElement('div');
    row.className = 'genai-pyr-row';
    row.style.setProperty('--row-bg', tc.rgba);
    row.setAttribute('data-tier', t);
    row.setAttribute('data-tier-label', tc.label);
    row.setAttribute('aria-label', tc.label + ': ' + tc.desc);

    byTier[t].forEach(function (tool) {
      var block = document.createElement('div');
      block.className = 'genai-pyr-block';
      block.setAttribute('data-tooltip', tool.name);
      block.setAttribute('tabindex', '0');
      block.setAttribute('role', 'button');
      block.setAttribute('aria-label', tool.name + ' — ' + tc.label);

      var img = document.createElement('img');
      img.src   = tool.logo;
      img.alt   = tool.name;
      img.className = 'genai-pyr-logo';
      img.onerror = function () {
        img.style.display = 'none';
        var fb = document.createElement('div');
        fb.className = 'genai-pyr-logo-fb';
        fb.setAttribute('aria-hidden', 'true');
        fb.textContent = tool.name.charAt(0);
        block.appendChild(fb);
      };
      block.appendChild(img);

      block.addEventListener('click', function () { openModal(tool); });
      block.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(tool); }
      });

      row.appendChild(block);
    });

    wrap.appendChild(row);
  });

  // ── Build legend ───────────────────────────────────────────────────────────
  var legendEl = document.getElementById('genaiPyrLegend');
  if (legendEl) {
    [1, 2, 3, 4, 5, 6].forEach(function (t) {
      var tc   = TIERS[t];
      var pill = document.createElement('div');
      pill.className = 'genai-legend-pill';
      pill.innerHTML =
        '<span class="genai-legend-dot" style="background:' + tc.color + '" aria-hidden="true"></span>' +
        '<span class="genai-legend-text"><strong>' + tc.label + '</strong> &mdash; ' + tc.desc + '</span>';
      legendEl.appendChild(pill);
    });
  }

  // ── Modal ─────────────────────────────────────────────────────────────────
  var backdrop      = document.getElementById('genaiModalBackdrop');
  var closeBtn      = document.getElementById('genaiModalClose');
  var modalLogo     = document.getElementById('genaiModalLogo');
  var modalLogoFb   = document.getElementById('genaiModalLogoFb');
  var modalName     = document.getElementById('genaiModalName');
  var modalTierPill = document.getElementById('genaiModalTierPill');
  var modalDesc     = document.getElementById('genaiModalDesc');
  var modalUsage    = document.getElementById('genaiModalUsage');
  var modalCases    = document.getElementById('genaiModalCases');

  function openModal(tool) {
    var tc = TIERS[tool.tier];

    modalLogo.src   = tool.logo;
    modalLogo.alt   = tool.name;
    modalLogo.style.display = '';
    modalLogoFb.style.display = 'none';
    modalLogo.onerror = function () {
      modalLogo.style.display = 'none';
      modalLogoFb.style.display = 'flex';
      modalLogoFb.textContent = tool.name.charAt(0);
    };

    modalName.textContent     = tool.name;
    modalTierPill.textContent = tc.label + ' — ' + tc.desc;
    modalTierPill.style.background = tc.color;
    modalDesc.textContent  = tool.desc;
    modalUsage.textContent = tool.usage;

    modalCases.innerHTML = '';
    tool.cases.forEach(function (c) {
      var li = document.createElement('li');
      li.textContent = c;
      modalCases.appendChild(li);
    });

    var scrollEl = backdrop.querySelector('.genai-modal-scroll');
    if (scrollEl) scrollEl.scrollTop = 0;

    backdrop.setAttribute('aria-hidden', 'false');
    backdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    backdrop.classList.remove('is-open');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  backdrop.addEventListener('click', function (e) {
    if (e.target === backdrop) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && backdrop.classList.contains('is-open')) closeModal();
  });
})();
