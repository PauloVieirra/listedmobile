import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../Services/supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importando o AsyncStorage
import { styles } from '../Screens/StylesGlobal';

// Criando o contexto global
const GlobalContext = createContext();

// Provider para fornecer os dados para o aplicativo
export const GlobalProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [selectedAtletaProfile, setSelectedAtletaProfile] = useState(null);
  const [selectedAtleta, setSelectedAtleta] = useState([]); 
  const [selectedGender, setSelectedGender] = useState("all");
  const [eventos, setEventos] = useState([]);
  const [selectStyle, setSelectStyle] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState(null);  
  const [userSupaBase, setUserSupaBase] = useState (null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);  
  const [isLoading, setIsLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Carregando...');
  const [loadingMessage, setLoadingMessage] = useState('');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [locais, setLocais] = useState([]);
  const [themeName, setThemeName] = useState('light'); 
  const [editRank, setIsEditRank] = useState([]);
  const [feed, setFeed] = useState([]);




  const iconTextColor = themeName === 'light' ? 'black' : 'white';

  useEffect(() => {
    const checkSessionAndLoadUser = async () => {
      try {
        // Verificar a sessão do Supabase
        const { data: session, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Erro ao verificar sessão do Supabase:', error.message);
        }
  
        if (session?.user) {
          // Se o usuário estiver logado no Supabase, vamos usar a sessão
          setUser(session.user);
          setIsLoggedIn(true); // Marca como logado
          
          // Persistir o estado de login no AsyncStorage
          await AsyncStorage.setItem('isLoggedIn', 'true');
          await AsyncStorage.setItem('user', JSON.stringify(session.user));
        } else {
          // Caso contrário, carrega o usuário do AsyncStorage
          const storedUser = await AsyncStorage.getItem('user');
          const storedIsLoggedIn = await AsyncStorage.getItem('isLoggedIn');
  
          if (storedUser && storedIsLoggedIn === 'true') {
            const user = JSON.parse(storedUser);
            setUser(user);
            setIsLoggedIn(true);  // Se o estado de login for encontrado, marca como logado
            await fetchUserProfile(user.user_id); // Busca o perfil
          } else {
            setIsLoggedIn(false);  // Marca como não logado
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Erro ao verificar sessão e carregar usuário:', error);
        setIsLoggedIn(false);
        setUser(null);
      }
    };
  
    checkSessionAndLoadUser();  // Executa a função ao carregar o app
  }, []);  // Esse useEffect só roda uma vez na inicialização
  

  const saveUserLocally = async (user, userSupaBase) => {
    try {
      // Combina os dados de user e userSupaBase
      const combinedUserData = {
        ...user,               // Dados do usuário
        ...userSupaBase,       // Dados adicionais do userSupaBase (como ID, etc.)
      };
      
  
      // Salvando os dados combinados no AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(combinedUserData));
      //console.log('Dados do usuário salvos com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar usuário no AsyncStorage:', error);
    }
  };

    // Função no contexto (GlobalContext.js)
const saveUserProfile = async (name, ano, funcao, estatura, genero,imageUrl) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        id: user.id,  
        name,
        ano,
        funcao,
        estatura,
        genero,
        imageUrl,
        complite: true,
      });
    if (error) {
      throw new Error('Erro ao salvar perfil: ' + error.message);
    }
    setLoading(false);
    fetchUserProfile();
  } catch (error) {
    throw error;
  }
};

  

      // Função para buscar os dados do perfil do usuário
  const fetchUserProfile = async (userId) => {
   
    try {
      // Verifique se o userId é válido e se é um UUID
      if (userId && typeof userId === 'string' && userId.length === 36) {
        // Busca os dados do perfil do usuário utilizando o UUID
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .single(); // Espera um único resultado

        if (error) {
          console.error('Erro ao buscar o perfil do usuário:', error.message);
        } else {
          // Exibe os dados do usuário no console (dados do perfil)
          //console.log('Dados do perfil retornados:', data);

          // Atualiza o estado do usuário com os dados de autenticação + perfil
          setUser((prevUser) => ({
            ...prevUser, // Mantém os dados de autenticação
            ...data,     // Adiciona os dados do perfil
          
          }));

          // Salva os dados no AsyncStorage (se necessário)
          await saveUserLocally({
            ...user, // Dados de autenticação
            ...data, // Dados do perfil
          });
        }
      } else {
        //console.error('ID de usuário inválido');
      }
    } catch (error) {
      console.error('Erro ao buscar dados do perfil:', error.message);
    }
  };

  useEffect(() => {
    // Função para carregar o perfil do usuário após o login
    const loadUserProfile = async () => {
      const storedUser = await AsyncStorage.getItem('user');  // Buscando usuário no AsyncStorage

      if (storedUser) {
        const user = JSON.parse(storedUser);  // Parse o usuário do AsyncStorage
        if (user?.id) {
          fetchUserProfile(user.id);  // Passa o user_id para buscar o perfil
        }
      }
    };

    loadUserProfile();  // Chama a função para carregar o perfil do usuário
  }, []);  // O useEffect vai ser executado uma vez na inicialização do app
     

    // Carrega o tema salvo no AsyncStorage quando o app inicia
    useEffect(() => {
      const loadTheme = async () => {
        try {
          const savedTheme = await AsyncStorage.getItem('@theme');
          if (savedTheme) {
            setThemeName(savedTheme);
          }
        } catch (error) {
          console.log('Erro ao carregar o tema:', error);
        }
      };
  
      loadTheme();
    }, []);

  const toggleTheme = async () => {
    try {
      const newTheme = themeName === 'light' ? 'dark' : 'light';
      setThemeName(newTheme);
      await AsyncStorage.setItem('@theme', newTheme); // Salva o novo tema
    } catch (error) {
      console.log('Erro ao salvar o tema:', error);
    }
  };

  // Seleciona os estilos com base no tema atual
  const themeStyles = styles[themeName];
  
    // Função para buscar locais no Supabase
  async function fetchLocais() {
    setLoading(true);
    const { data, error } = await supabase.from('locais').select('*');
    if (error) {
      console.error('Erro ao buscar locais:', error.message);
    } else {
      setLocais(data);
    }
    setLoading(false);
  }

  // Busca inicial dos locais
  useEffect(() => {
    fetchLocais();
  }, []);

  async function fetchEventos() {
    setLoading(true);
    const { data, error } = await supabase.from('eventos').select('*');
    if (error) {
      console.error('Erro ao buscar locais:', error.message);
    } else {
      setEventos(data);
    }
    setLoading(false);
  }

  // Busca inicial dos eventos
  useEffect(() => {
    fetchEventos();
  }, []);

  // Função para carregar os atletas do Supabase
  const fetchAtletas = async () => {
    try {
      handleLoading(true, 'Carregando atletas...');

      let query = supabase
        .from('atletas_basquete')
        .select('*'); // Buscar todos os atletas
  
      if (selectedGender !== "all") {
        query = query.eq('genero', selectedGender); // Filtro por gênero
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      setSelectedAtleta(data); // Armazena os atletas no estado

    } catch (error) {
      console.error('Erro ao buscar atletas:', error.message);
    } finally {
      handleLoading(false);
    }
  };

  const updateAtleta = (atleta) => {
    setSelectedAtletaProfile(atleta); // Atualize o atleta selecionado no contexto
  };

  const updateGender = (gender) => {
    setSelectedGender(gender); // Atualizando genero da lista
  };

  // Função de cadastro
  const signUp = async (email, password) => {
    try {
      handleLoading(true, 'Criando sua conta...'); // Ativa o loading ao iniciar o cadastro

      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password,
        sendEmailVerification: false
      });

      if (error) throw new Error(error.message);

      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .insert([{ id: user.id, email }]);

      if (profileError) throw new Error(profileError.message);

      await saveUserLocally(user);
      setUser(user);  // Atualiza o estado do usuário
      setIsLoggedIn(true);  // Marca como logado
      fetchUserProfile();
      
      return { user };
    } catch (error) {
      console.error('Erro ao fazer cadastro:', error.message);
      throw error;
    } finally {
      handleLoading(false); // Desativa o loading após o cadastro
    }
  };

  // Função de login
  const login = async (email, password) => {
    try {
      handleLoading(true, 'Entrando...'); // Ativa o loading ao iniciar o login
  
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
  
      if (error) throw new Error(error.message);
  
      // Verifica se o usuário foi autenticado
      if (user) {
        setUser(user);  // Atualiza o estado do usuário
        
        setIsLoggedIn(true);  // Marca o usuário como logado
  
        // Use o user.user_id (UUID) para buscar o perfil
        await fetchUserProfile(user.user_id); // Passa o UUID para a busca do perfil
        setUserSupaBase(user);
        // Salva o estado de login no AsyncStorage
        await AsyncStorage.setItem('isLoggedIn', 'true');
        await AsyncStorage.setItem('user', JSON.stringify(user));
      }
  
      return { user };
    } catch (error) {
      console.error('Erro ao fazer login:', error.message);
      throw error;
    } finally {
      handleLoading(false); // Desativa o loading após o login
    }
  };
  
 // Função de logout
const logout = async () => {
  try {
    // Inicia a operação de logout
    setIsLoading(true); // Define isLoading como true enquanto o logout está sendo processado
    
    // Realiza o logout no Supabase
    await supabase.auth.signOut();

    // Limpa o estado do usuário e marca como não logado
    setUser(null);
    setIsLoggedIn(false); 

    // Remove o usuário do AsyncStorage
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('isLoggedIn');
    await AsyncStorage.removeItem('userProfile'); // Certifique-se de que userProfile é necessário

  } catch (error) {
    console.error('Erro ao fazer logout:', error);
  } finally {
    setIsLoading(false); // Garante que o estado de carregamento seja falso após o processo, independentemente de erro ou sucesso
  }
};


  
  // Função handleLoading para incluir uma mensagem
  const handleLoading = (loading, message = '') => {
    setLoading(loading);
    setLoadingMessage(message);
  };

  // Carregar atletas ao montar o componente
  useEffect(() => {
    fetchAtletas();  // Busca os atletas ao inicializar o componente
  }, [selectedGender]); // Recarrega os atletas sempre que o gênero mudar


 // Função para cadastrar atleta
 const cadastrarAtletaBasquete = async (atleta) => {
  try {
    const { data, error } = await supabase.from('atletas_basquete').insert([atleta]);
    if (error) throw error;
    console.log('Atleta cadastrado:', data);
  } catch (error) {
    console.error('Erro ao cadastrar atleta:', error.message);
  }
};  

const setLoading = (loading, text = 'Carregando...') => {
  setIsLoading(loading);
  setLoadingText(text);  // Atualiza o texto de carregamento
};

  // Função para buscar os feeds da tabela
  const fetchFeeds = async () => {
    try {
      const { data, error } = await supabase
        .from('feed')
        .select('*')
        .order('id', { ascending: false }); // Ordenar pelo id ou algum campo que ajude a trazer os feeds mais recentes

      if (error) throw error;
      setFeed(data); // Atualiza o estado com os feeds
    } catch (error) {
      console.error('Erro ao buscar feeds:', error.message);
    }
  };

  // Efeito para buscar os feeds ao montar o componente
  useEffect(() => {
    fetchFeeds(); // Chama a função para buscar os feeds

  }, []); // O array vazio faz com que o useEffect seja executado apenas uma vez, ao montar o componente.


  const updateCurtidas = async (id, curtidas, curtidos) => {
    const { data, error } = await supabase
      .from('feed') // Nome da tabela
      .update({ curtidas, curtidos })
      .eq('id', id);
  
    if (error) {
      console.log('Erro ao atualizar curtidas:', error);
    } else {
      console.log('Curtidas atualizadas com sucesso');
    }
  };

  const removeCurtida = async (id, curtidas, curtidos, userId) => {
    // Remove o userId do array de curtidos
    const { data, error } = await supabase
      .from('feed')
      .update({
        curtidas: curtidas - 1,  // Decrementa o contador de curtidas
        curtidos: supabase.raw('array_remove(curtidos, ?)', [userId])  // Remove o userId do array de curtidos
      })
      .eq('id', id);
  
    if (error) {
      console.log('Erro ao remover curtida:', error);
    } else {
      console.log('Curtida removida com sucesso');
    }
  };

  const updateSeguidor = async (id_user, seguidores) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ seguidores })
        .eq('id', id_user); // Atualiza a coluna 'seguidores' com o novo array
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Erro ao atualizar seguidores:", error);
    }
  };
  
  
  
  


  return (
    <GlobalContext.Provider value={{ 
      selectedAtleta, 
      selectedGender, 
      selectStyle,
      isDarkMode,
      user,    
      isLoggedIn,
      setIsLoggedIn,
      selectedAtletaProfile,
      isSuperAdmin,
      themeName,       // Nome do tema atual
        themeStyles,     // Estilos do tema atual
        locais, 
        isLoading,
        setLoading, 
        eventos,
        userProfile,
        editRank,
        feed,
        updateSeguidor,
        updateCurtidas,
        removeCurtida,
        setFeed,
        setIsEditRank,
        cadastrarAtletaBasquete,
        refetch: fetchLocais,
        toggleTheme,     // Função para alternar o tema
      updateGender,
      setSelectedAtleta,
      setIsDarkMode,
      updateAtleta,
      signUp,
      login,
      logout,
      handleLoading,
      saveUserProfile,
      fetchUserProfile,
      iconTextColor
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

// Hook customizado para acessar o contexto
export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
