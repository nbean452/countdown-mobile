import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";

import { DB_URL, DB_ANON_KEY } from "./env";

const client = createClient(DB_URL, DB_ANON_KEY);

export default client;
