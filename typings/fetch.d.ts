interface Headers {
	[key: string]: string;
}

interface Body {
	bodyUsed: boolean;

	arrayBuffer(): Promise<ArrayBuffer>;
	blob(): Promise<Blob>;
	formData(): Promise<FormData>;
	json(): Promise<any>;
	text(): Promise<string>;
}

interface RequestOptions {
	method?: string;
	headers?: Headers | string;
	body?: Blob | FormData | string;
	mode?: string;
	credentials?: string;
	cache?: string;
	redirect?: string;
	referrer?: string;
}

interface Request extends Body {
	constructor(input: string | Request, init?: RequestOptions);

	url: string;
	headers: Headers;
	referrer: string;
	mode: string;
	credentials: string;
	redirect: string;
	integrity: string;
	cache: string;
}

interface Response extends Body {
	constructor(body?: Blob | FormData | string, init?: number | string | Headers);

	type: string;
	url: string;
	useFinalURL: boolean;
	status: number;
	ok: boolean;
	statusText: string;
	headers: Headers;
}

declare function fetch(input: string | Request, init?: RequestOptions): Promise<Response>;

interface GlobalFetch {
	fetch(input: string | Request, init?: RequestOptions): Promise<Response>;
}

interface Window extends GlobalFetch {
}